from datetime import datetime, timedelta
import random

# Use your existing in-memory store
otp_store = {}


def clean_expired_otps():
    """Remove expired OTPs"""
    global otp_store
    otp_store = {k: v for k, v in otp_store.items() if v["expiry"] > datetime.utcnow()}

def create_otp(email, purpose="general"):
    """Create an OTP for an email with optional purpose"""
    clean_expired_otps()
    otp = str(random.randint(100000, 999999))
    otp_store[email] = {
        "otp": otp,
        "expiry": datetime.utcnow() + timedelta(minutes=5),
        "verified": False,
        "purpose": purpose
    }
    return otp

def verify_otp(email, otp, purpose="general"):
    if email not in otp_store:
        return False, "No OTP found"
    data = otp_store[email]
    if datetime.utcnow() > data["expiry"]:
        return False, "OTP expired"
    if data["otp"] != otp:
        return False, "OTP mismatch"
    if data.get("purpose") != purpose:
        return False, "OTP not valid for this action"
    otp_store[email]["verified"] = True
    return True, "Verified"

def is_verified_otp(email, purpose="general"):
    data = otp_store.get(email)
    return bool(data and data["verified"] and data.get("purpose") == purpose)