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
import razorpay
import hmac, hashlib
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator



# Load env variables
load_dotenv()

razorpay_client = razorpay.Client(auth=(
    os.getenv("RAZORPAY_KEY_ID"),
    os.getenv("RAZORPAY_KEY_SECRET")
))

client = MongoClient(os.getenv('MONGO_URI'))
db = client["LoginData"]
users_collection = db["Users"]


db = client["Orders"]
orders_collection=db["order_collections"]

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
                subject = "🔐 Your OTP Code"

                # ✅ HTML template
                html_content = f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
                    <h2 style="color: #4CAF50; text-align: center;">Kazuha Closet</h2>
                    <p>Hi there 👋,</p>
                    <p>We received a request to verify your email address. Use the OTP below to complete the process:</p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; color: #333; padding: 10px 20px; border: 2px dashed #4CAF50; border-radius: 5px; display: inline-block;">
                            {otp}
                        </span>
                    </div>

                    <p>This OTP is valid for <b>5 minutes</b>. Do not share it with anyone.</p>
                    <p style="color: #999; font-size: 12px;">If you did not request this, you can safely ignore this email.</p>
                    <hr>
                    <p style="text-align: center; font-size: 12px; color: #888;">© 2025 Kazuha Closet</p>
                </div>
                """

                # still keep plain text as fallback
                plain_text_content = f"Your OTP is {otp}. It is valid for 5 minutes."

                message = Mail(
                    from_email=from_email,
                    to_emails=email,
                    subject=subject,
                    plain_text_content=plain_text_content,
                    html_content=html_content
                )
                
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

            existing_user=users_collection.find_one({"email":email})
            if existing_user:
                return Response({"error": "Email already registered please login"}, status=400)

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
    



#   PAYMENT PART 

class CreateOrderView(APIView):
    def post(self,request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
        data=request.data
        amount=data.get('amount')
        amount_paise = int(amount) * 100
        try:

            # BASCIALLY IF ANY PROB HAPPENS I CAN CHECK MY MONGODB AND THE razorpay FOR ANY PAYMENT DISPUTE
            order = razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": "1"
            })
            orders_collection.insert_one({
                "user_id": user_id,
                "cart": data.get("cart", {}),
                "amount": amount,
                "currency": "INR",
                "razorpay_order_id": order["id"],
                "payment_status": "PENDING",
                "created_at": datetime.utcnow()
            })
            return Response(order, status=200)
        except Exception as e:
            return Response({"error":str(e)},status=400)


@method_decorator(csrf_exempt, name="dispatch")
class VerifyPaymentView(APIView):
     def post(self, request):
        data = request.data
        order_id = data.get("razorpay_order_id")
        payment_id = data.get("razorpay_payment_id")
        signature = data.get("razorpay_signature")
        try:
            generated_signature = hmac.new(
                os.getenv("RAZORPAY_KEY_SECRET").encode(),
                f"{order_id}|{payment_id}".encode(),
                hashlib.sha256
            ).hexdigest()

            if generated_signature == signature:
                # ✅ Update DB
                orders_collection.update_one(
                    {"razorpay_order_id": order_id},
                    {"$set": {"payment_status": "PAID", "payment_id": payment_id}}
                )
                return Response({"status": "Payment verified"}, status=200)
            else:
                return Response({"status": "Verification failed"}, status=400)

        except Exception as e:
            return Response({"error": str(e)}, status=400)

        


