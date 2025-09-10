from datetime import datetime, timedelta
import random

# Use your existing in-memory store
otp_store = {}

def clean_expired_otps():
    """Remove expired OTPs to save memory"""
    global otp_store
    otp_store = {k: v for k, v in otp_store.items() if v["expiry"] > datetime.utcnow()}

def create_otp(email):
    clean_expired_otps()  # always clean before creating new
    otp = str(random.randint(100000, 999999))
    otp_store[email] = {
        "otp": otp,
        "expiry": datetime.utcnow() + timedelta(minutes=5),
        "verified": False
    }
    return otp

def verify_otp(email, otp):
    if email not in otp_store:
        return False, "No OTP found"
    data = otp_store[email]
    if datetime.utcnow() > data["expiry"]:
        return False, "OTP expired"
    if data["otp"] != otp:
        return False, "OTP mismatch"
    otp_store[email]["verified"] = True
    return True, "Verified"
