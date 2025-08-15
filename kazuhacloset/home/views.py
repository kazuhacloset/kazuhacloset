from pymongo import MongoClient
import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    RegisterSerializer, LoginSerializer, ProfileSerializer,
    UpdateProfileSerializer, AddToCartSerializer,
    SendOtpSerializer, VerifyOtpSerializer
)
from django.contrib.auth.hashers import make_password, check_password
from bson.objectid import ObjectId
import jwt
from datetime import datetime, timedelta
import random
from django.core.mail import send_mail
import sendgrid
from sendgrid.helpers.mail import Mail

# Load env variables
load_dotenv()
client = MongoClient(os.getenv('MONGO_URI'))
db = client["LoginData"]
users_collection = db["Users"]

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = "HS256"

# Temporary OTP store { email: {"otp": "123456", "expiry": datetime, "verified": bool} }
otp_store = {}

# JWT helpers
def create_jwt(user_id):
    payload = {
        "user_id": str(user_id),
        "exp": datetime.utcnow() + timedelta(days=1)
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_jwt(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Send OTP
class SendOtpView(APIView):
    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = str(random.randint(100000, 999999))
            otp_store[email] = {
                "otp": otp,
                "expiry": datetime.utcnow() + timedelta(minutes=5),
                "verified": False
            }

            try:
                sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
                from_email = os.getenv("SENDGRID_FROM_EMAIL")
                subject = "Your OTP Code"
                content = f"Your OTP is {otp}. It is valid for 5 minutes."
                message = Mail(from_email=from_email, to_emails=email, subject=subject, plain_text_content=content)
                sg.send(message)
                return Response({"message": "OTP sent successfully"}, status=200)
            except Exception as e:
                return Response({"error": f"Failed to send OTP: {str(e)}"}, status=500)

        return Response(serializer.errors, status=400)

# Verify OTP
class VerifyOtpView(APIView):
    def post(self, request):
        serializer = VerifyOtpSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            if email not in otp_store:
                return Response({"error": "No OTP found for this email"}, status=404)

            data = otp_store[email]
            if datetime.utcnow() > data["expiry"]:
                return Response({"error": "OTP expired"}, status=400)

            if data["otp"] != otp:
                return Response({"error": "Invalid OTP"}, status=400)

            otp_store[email]["verified"] = True
            return Response({"verified": True, "message": "OTP verified successfully"}, status=200)

        return Response(serializer.errors, status=400)

# Register with OTP check
class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']

            if email not in otp_store or not otp_store[email]["verified"]:
                return Response({"error": "Email not verified via OTP"}, status=400)

            if otp_store[email]["otp"] != otp:
                return Response({"error": "OTP mismatch"}, status=400)

            user_data = {
                "first_name": serializer.validated_data['first_name'],
                "last_name": serializer.validated_data['last_name'],
                "email": email,
                "password": make_password(serializer.validated_data['password']),
                "cart": {}
            }
            result = users_collection.insert_one(user_data)
            user_id = result.inserted_id
            token = create_jwt(user_id)

            del otp_store[email]  # clear OTP after registration
            return Response({"message": "User registered successfully", "token": token}, status=201)
        return Response(serializer.errors, status=400)

# Login
class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = users_collection.find_one({"email": email})
            if user and check_password(password, user['password']):
                token = create_jwt(user["_id"])
                return Response({
                    "message": "Login successful",
                    "token": token,
                    "first_name": user.get("first_name", ""),
                    "id": str(user.get("_id"))
                }, status=200)
            return Response({"error": "Invalid credentials"}, status=401)
        return Response(serializer.errors, status=400)

# Cart add
class AddToCartView(APIView):
    def post(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            result = users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {f"cart.{data['product_id']}": [data['quantity'], data['size']]}}
            )
            if result.modified_count == 1:
                return Response({"message": "Item added to cart"}, status=200)
            else:
                return Response({"error": "User not found or cart not updated"}, status=404)
        return Response(serializer.errors, status=400)

# Cart view
class CartView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        user = users_collection.find_one({"_id": ObjectId(user_id)}, {"cart": 1})
        if not user:
            return Response({"error": "User not found"}, status=404)
        return Response({"cart": user.get("cart", {})}, status=200)

# Profile view
class UserProfileView(APIView):
    def get(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({"error": "User not found"}, status=404)
        serializer = ProfileSerializer({
            "id": str(user["_id"]),
            "email": user.get("email", ""),
            "first_name": user.get("first_name", ""),
            "last_name": user.get("last_name", ""),
        })
        return Response(serializer.data, status=200)

# Update profile
class UpdateProfileView(APIView):
    def put(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        serializer = UpdateProfileSerializer(data=request.data)
        if serializer.is_valid():
            update_data = serializer.validated_data
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return Response({"error": "User not found"}, status=404)
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return Response({"message": "Profile updated successfully"}, status=200)
        return Response(serializer.errors, status=400)

# Remove cart item
class Remove_Item(APIView):
    def delete(self, request, id):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({"error": "User not found"}, status=404)
        cart = user.get("cart", {})
        if id not in cart:
            return Response({"error": "Item not found in cart"}, status=404)
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$unset": {f"cart.{id}": ""}}
        )
        return Response({"message": "Item removed from cart successfully"}, status=200)
