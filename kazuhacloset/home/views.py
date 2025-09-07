from pymongo import MongoClient
import os
from dotenv import load_dotenv
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    RegisterSerializer, LoginSerializer, ProfileSerializer,
    UpdateProfileSerializer, AddToCartSerializer,
    SendOtpSerializer, VerifyOtpSerializer, ForgotPasswordSerializer, VerifyForgotOtpSerializer, ResetPasswordSerializer,ContactSupportSerializer
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
import json
from bson.json_util import dumps
import pytz
from datetime import datetime, timedelta
from pytz import timezone



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

db=client["History"]
order_history_collection= db["order_history"]

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

#contact info


class ContactSupportView(APIView):
    def post(self, request):
        serializer = ContactSupportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        name = serializer.validated_data["name"]
        email = serializer.validated_data["email"]
        message = serializer.validated_data["message"]

        try:
            sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
            from_email = os.getenv("SENDGRID_FROM_EMAIL")  # noreply@kazuhacloset.com
            support_email = os.getenv("SUPPORT_EMAIL", "kazuhastore8@gmail.com")  # your inbox

            subject = f"📩 Support Request from {name}"

            # ✅ Current IST time
            ist = timezone("Asia/Kolkata")
            now_ist = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

            # ✅ Send support request details to YOU (admin/support inbox)
            support_msg = Mail(
                from_email=from_email,
                to_emails=support_email,
                subject=subject,
                html_content=f"""
                <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
                    <h2 style="color:#4CAF50; text-align:center;">Kazuha Closet Support</h2>
                    <p><b>Name:</b> {name}</p>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Time:</b> {now_ist} (IST)</p>
                    <p><b>Message:</b></p>
                    <p style="white-space:pre-line;">{message}</p>
                </div>
                """
            )
            sg.send(support_msg)

            # ✅ Auto reply to user
            auto_reply = Mail(
                from_email=from_email,
                to_emails=email,
                subject="✅ We received your support request",
                html_content=f"""
                    <p>Hi {name},</p>
                    <p>Thanks for reaching out to <b>Kazuha Closet</b>! 🎉</p>
                    <p>We received your message at <b>{now_ist} (IST)</b> and will get back to you soon.</p>
                    <br/>
                    <p>– Kazuha Closet Support Team</p>
                """
            )
            sg.send(auto_reply)

            return Response({"message": "Support request sent successfully"}, status=200)

        except Exception as e:
            return Response({"error": f"Failed to send message: {str(e)}"}, status=500)


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
                "cart": []
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

# FORGET POSSWORD VIEW
class ForgotPasswordOtpView(APIView):
    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)  # ✅ use serializer
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]

        user = users_collection.find_one({"email": email})
        if not user:
            return Response({"error": "No account found with this email"}, status=404)

        otp = str(random.randint(100000, 999999))
        otp_store[email] = {
            "otp": otp,
            "expiry": datetime.utcnow() + timedelta(minutes=5),
            "verified": False,
            "purpose": "forgot_password"
        }

        try:
            sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
            from_email = os.getenv("SENDGRID_FROM_EMAIL")
            subject = "🔐 Password Reset OTP"

            html_content = f"""
                <h2>Kazuha Closet</h2>
                <p>We received a request to reset your password.</p>
                <p>Your OTP is:</p>
                <h3>{otp}</h3>
                <p>This OTP is valid for 5 minutes. If you didn’t request it, ignore this email.</p>
            """

            message = Mail(
                from_email=from_email,
                to_emails=email,
                subject=subject,
                html_content=html_content
            )
            sg.send(message)

            return Response({"message": "OTP sent for password reset"}, status=200)

        except Exception as e:
            return Response({"error": f"Failed to send OTP: {str(e)}"}, status=500)


class VerifyForgotPasswordOtpView(APIView):
    def post(self, request):
        serializer = VerifyForgotOtpSerializer(data=request.data)  # ✅ use serializer
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        if email not in otp_store:
            return Response({"error": "No OTP found for this email"}, status=404)

        data = otp_store[email]
        if datetime.utcnow() > data["expiry"]:
            return Response({"error": "OTP expired"}, status=400)

        if data["otp"] != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        if data.get("purpose") != "forgot_password":
            return Response({"error": "OTP not for password reset"}, status=400)

        otp_store[email]["verified"] = True
        return Response({"verified": True, "message": "OTP verified, proceed to reset password"}, status=200)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)  # ✅ use serializer
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data["email"]
        new_password = serializer.validated_data["new_password"]

        if email not in otp_store or not otp_store[email]["verified"]:
            return Response({"error": "OTP not verified for this email"}, status=400)

        user = users_collection.find_one({"email": email})
        if not user:
            return Response({"error": "User not found"}, status=404)

        hashed_password = make_password(new_password)
        users_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

        # ✅ Clear OTP after success
        del otp_store[email]

        return Response({"message": "Password reset successful"}, status=200)

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
            product_id = str(data['product_id'])
            size = str(data['size']).upper()
            quantity = int(data['quantity'])

            # ✅ Create cart_key = product_id-size
            cart_key = f"{product_id}-{size}"
            users_collection.update_many(
                {"cart": {"$type": "array"}},
                {"$set": {"cart": {}}}
            )

            user = users_collection.find_one({"_id": ObjectId(user_id)})
            if not user:
                return Response({"error": "User not found"}, status=404)

            # ✅ If item exists → increment quantity
            if f"cart.{cart_key}" in user.get("cart", {}):
                users_collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$inc": {f"cart.{cart_key}.quantity": quantity}}
                )
            else:
                # ✅ Otherwise create new entry
                users_collection.update_one(
                    {"_id": ObjectId(user_id)},
                    {"$set": {
                        f"cart.{cart_key}": {
                            "product_id": product_id,
                            "size": size,
                            "quantity": quantity
                        }
                    }}
                )

            return Response({"message": "Item added to cart"}, status=200)

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
    def delete(self, request, cart_key):
        # ✅ Check JWT auth
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)

        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)

        # ✅ Find user
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if not user:
            return Response({"error": "User not found"}, status=404)

        # ✅ Get cart (stored as dict)
        cart = user.get("cart", {})

        if cart_key not in cart:
            return Response({"error": "Item not found in cart"}, status=404)

        # ✅ Remove item from cart
        users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$unset": {f"cart.{cart_key}": ""}}
        )

        return Response({"message": f"Item {cart_key} removed successfully"}, status=200)
    



#   PAYMENT PART 

class CreateOrderView(APIView):
    def post(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)
        token = auth_header.split(" ")[1]
        user_id = decode_jwt(token)
        if not user_id:
            return Response({"error": "Invalid or expired token"}, status=401)
            
        data = request.data
        amount = data.get('amount')
        amount_paise = int(amount) * 100
        
        try:
            user = users_collection.find_one({"_id": ObjectId(user_id)})
            order = razorpay_client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "payment_capture": "1"
            })
            # ✅ Store complete order details including product info
            orders_collection.insert_one({
                "user_id": user_id,
                "cart": data.get("cart", {}),
                "amount": amount,
                "currency": "INR",
                "razorpay_order_id": order["id"],
                "payment_status": "PENDING",
                "address": data.get("address", ""),
                "phone": data.get("phone", ""),
                "name": user.get("name", ""),     
                "email": user.get("email", ""),   
                "created_at": datetime.utcnow()
            })
            
            return Response(order, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


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

            if generated_signature != signature:
                return Response({"status": "Verification failed"}, status=400)

            order = orders_collection.find_one({"razorpay_order_id": order_id})
            if not order:
                return Response({"error": "Order not found"}, status=404)

            order["payment_status"] = "PAID"
            order["payment_id"] = payment_id
            order["verified_at"] = datetime.utcnow()

            # ✅ Move to order history
            order_history_collection.insert_one(order)

            # Remove from pending orders
            orders_collection.delete_one({"razorpay_order_id": order_id})

            # ✅ Clear user's cart after successful payment
            users_collection.update_one(
                {"_id": ObjectId(order["user_id"])},
                {"$set": {"cart": {}}}
            )

            # ✅ Fetch the latest order for invoice (from order_history)
            latest_order = order_history_collection.find_one(
                {"user_id": order["user_id"]},
                sort=[("created_at", -1)]
            )

            # ✅ Send Payment Confirmation Email (via SendGrid)
            user = users_collection.find_one({"_id": ObjectId(order["user_id"])})
            if user and "email" in user and latest_order:
                try:
                    sg = sendgrid.SendGridAPIClient(api_key=os.getenv("SENDGRID_API_KEY"))
                    from_email = os.getenv("SENDGRID_FROM_EMAIL")
                    subject = "🧾 Invoice - Order Confirmation"

                    ist = timezone("Asia/Kolkata")
                    order_time = datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S")

                    # ✅ FIXED: Handle cart structure properly
                    cart_data = latest_order.get("cart", {})
                    cart_items = []
                    if isinstance(cart_data, dict) and "items" in cart_data:
                        cart_items = cart_data["items"]
                    elif isinstance(cart_data, list):
                        cart_items = cart_data
                    else:
                        print(f"Warning: Unexpected cart format: {cart_data}")
                        cart_items = []

                    html_content = f"""
                    <!DOCTYPE html>
                    <html>
                    <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    </head>
                    <body style="font-family: Arial, sans-serif; margin:0; padding:0; background:#f9f9f9;">
                    <div style="max-width:600px; margin:20px auto; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <div style="background:#2c3e50; padding:20px; text-align:center; color:#fff;">
                        <h2 style="margin:0;">Kazuha Closet</h2>
                        <p style="margin:5px 0;">Order Invoice</p>
                        </div>

                        <!-- Body -->
                        <div style="padding:20px; color:#333;">
                        <p>Hi {user.get("first_name", "Customer")},</p>
                        <p>Thank you for your purchase! 🎉<br>Here are your order details:</p>

                        <!-- Order Info -->
                        <table style="width:100%; margin:15px 0; border-collapse: collapse;">
                            <tr>
                            <td><strong>Order ID:</strong></td>
                            <td>{latest_order.get("razorpay_order_id", order_id)}</td>
                            </tr>
                            <tr>
                            <td><strong>Payment ID:</strong></td>
                            <td>{latest_order.get("payment_id", payment_id)}</td>
                            </tr>
                            <tr>
                            <td><strong>Date:</strong></td>
                            <td>{order_time}</td>
                            </tr>
                        </table>
                    """

                    # ✅ Items Table
                    html_content += """
                        <h3 style="margin-top:20px;">Order Summary</h3>
                        <table style="width:100%; border-collapse: collapse; margin-top:10px;">
                            <thead>
                            <tr style="background:#f2f2f2;">
                                <th style="padding:10px; border:1px solid #ddd; text-align:left;">Item</th>
                                <th style="padding:10px; border:1px solid #ddd; text-align:center;">Size</th>
                                <th style="padding:10px; border:1px solid #ddd; text-align:center;">Qty</th>
                                <th style="padding:10px; border:1px solid #ddd; text-align:right;">Price</th>
                                <th style="padding:10px; border:1px solid #ddd; text-align:right;">Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                    """

                    total_price = 0
                    for item in cart_items:
                        product_name = item.get("name", "Product")
                        qty = item.get("quantity", 1)
                        size = item.get("size", "N/A")
                        price_str = str(item.get("price", 0))
                        clean_price = float(''.join(c for c in price_str if c.isdigit() or c == '.') or '0')
                        subtotal = clean_price * qty
                        total_price += subtotal
                        html_content += f"""
                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">{product_name}</td>
                                <td style="padding:10px; border:1px solid #ddd; text-align:center;">{size}</td>
                                <td style="padding:10px; border:1px solid #ddd; text-align:center;">{qty}</td>
                                <td style="padding:10px; border:1px solid #ddd; text-align:right;">₹{clean_price:.2f}</td>
                                <td style="padding:10px; border:1px solid #ddd; text-align:right;">₹{subtotal:.2f}</td>
                            </tr>
                        """

                    html_content += f"""
                            </tbody>
                            <tfoot>
                                <tr style="background:#f8f9fa; font-weight:bold;">
                                    <td colspan="4" style="padding:10px; border:1px solid #ddd; text-align:right;">Grand Total:</td>
                                    <td style="padding:10px; border:1px solid #ddd; text-align:right; color:#28a745;">₹{total_price:.2f}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <!-- Shipping Address -->
                        <div style="margin-top:20px; padding:15px; background:#f8f9fa; border-radius:5px;">
                            <h4 style="margin:0 0 10px 0; color:#333;">Shipping Address:</h4>
                            <p style="margin:0; color:#666;">{latest_order.get('address', 'Address not provided')}</p>
                            <p style="margin:5px 0 0 0; color:#666;"><strong>Phone:</strong> {latest_order.get('phone', 'Phone not provided')}</p>
                        </div>

                        <p style="margin-top:20px;">Your order is now being processed. You'll receive another update when it ships 🚚</p>
                        </div>

                        <!-- Footer -->
                        <div style="background:#f2f2f2; padding:15px; text-align:center; font-size:12px; color:#555;">
                        <p>If you have any questions, contact us at <a href="mailto:kazuhastore8@gmail.com">support@kazuhacloset.com</a></p>
                        <p>© {datetime.utcnow().year} Kazuha Closet. All rights reserved.</p>
                        </div>
                    </div>
                    </body>
                    </html>
                    """

                    message = Mail(
                        from_email=from_email,
                        to_emails=user["email"],
                        subject=subject,
                        html_content=html_content
                    )
                    sg.send(message)
                    print(f"✅ Invoice sent successfully to {user['email']}")

                except Exception as e:
                    print(f"❌ Email sending failed: {str(e)}")
                    print(f"Cart data structure: {latest_order.get('cart', {})}")

            return Response({"status": "Payment verified"}, status=200)

        except Exception as e:
            print(f"❌ Payment verification error: {str(e)}")
            return Response({"error": str(e)}, status=400)



@method_decorator(csrf_exempt, name='dispatch')
class OrderHistoryView(APIView):
    def get(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return Response({"error": "Authorization token missing"}, status=401)

        token = auth_header.split(" ")[1]

        try:
            user_id = decode_jwt(token)  
            if not user_id:
                return Response({"error": "Invalid token"}, status=401)

            # Fetch all orders for this user
            orders_cursor = order_history_collection.find({"user_id": user_id})

            orders_list = []
            ist = timezone("Asia/Kolkata")

            for order in orders_cursor:
                # Convert ObjectId to string
                order["_id"] = str(order["_id"])

                # Convert created_at → IST
                if "created_at" in order and isinstance(order["created_at"], datetime):
                    order["created_at"] = order["created_at"].replace(
                        tzinfo=pytz.utc
                    ).astimezone(ist).strftime("%Y-%m-%d %H:%M:%S")

                # Convert paid_at → IST
                if "paid_at" in order and isinstance(order["paid_at"], datetime):
                    order["paid_at"] = order["paid_at"].replace(
                        tzinfo=pytz.utc
                    ).astimezone(ist).strftime("%Y-%m-%d %H:%M:%S")

                # Convert verified_at → IST
                if "verified_at" in order and isinstance(order["verified_at"], datetime):
                    order["verified_at"] = order["verified_at"].replace(
                        tzinfo=pytz.utc
                    ).astimezone(ist).strftime("%Y-%m-%d %H:%M:%S")

                orders_list.append(order)

            return Response(orders_list, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)