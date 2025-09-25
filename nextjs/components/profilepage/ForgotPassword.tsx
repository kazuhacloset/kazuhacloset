'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { sendForgotOtp, verifyForgotOtp, resetPassword } from '@/utils/api/userUtils';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    otp: '',
    new_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(''); // ✅ OTP error state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Step 1: Send OTP
  const handleSendOtp = async () => {
    if (!form.email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await sendForgotOtp(form.email);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message || "OTP sent successfully!");
    } catch {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // ✅ Step 2: Auto Verify OTP when length is 6
  useEffect(() => {
    const verify = async () => {
      if (form.email && form.otp.length === 6 && !otpVerified) {
        try {
          setIsVerifyingOtp(true);
          const res = await verifyForgotOtp(form.email, form.otp);
          if (res.verified) {
            setOtpVerified(true);
            setOtpError('');
            toast.success(res.message || "OTP verified successfully!");
          } else {
            setOtpVerified(false);
            setOtpError("Invalid OTP");
            toast.error(res.error || "Invalid OTP");
          }
        } catch {
          setOtpVerified(false);
          setOtpError("OTP verification failed");
          toast.error("OTP verification failed");
        } finally {
          setIsVerifyingOtp(false);
        }
      }
    };
    verify();
  }, [form.otp, form.email, otpVerified]);

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!otpVerified) {
      setOtpError("Please enter a valid 6-digit OTP");
      toast.error("Please verify OTP first");
      return;
    }
    if (!form.new_password) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      const res = await resetPassword(form.email, form.new_password);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message || "Password reset successful!");
      setTimeout(() => router.push('/login'), 1500);
    } catch {
      toast.error("Failed to reset password");
    }
  };

  // ✅ Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleResetPassword();
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onKeyDown={handleKeyDown}
    >
      {/* Background */}
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Forgot Password Box */}
      <div className="relative z-10 bg-black/30 backdrop-blur-md border border-transparent rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:border-white transition-all duration-500 ease-in-out transform hover:scale-105 w-[95%] sm:w-[90%] md:max-w-md px-3 py-4 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Forgot Password</h2>

        {/* Email + Send OTP */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1">Email</label>
          <div className="flex flex-wrap gap-2">
            <input
              type="email"
              id="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Enter your email"
              className="flex-1 min-w-[140px] p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="flex-shrink-0 bg-yellow-400 text-black px-3 py-2 sm:px-4 sm:py-3 rounded-lg hover:bg-yellow-300 transition text-sm"
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>

        {/* OTP (auto verifies) */}
        <div className="mb-3 sm:mb-4 relative">
          <label
            htmlFor="otp"
            className="block text-xs sm:text-sm font-medium mb-1"
          >
            Verification OTP
          </label>
          <div className="relative">
            <input
              type="text"
              id="otp"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm({ ...form, otp: value });
                if (value.length < 6) {
                  setOtpError("OTP must be 6 digits");
                  setOtpVerified(false);
                } else {
                  setOtpError("");
                }
              }}
              value={form.otp}
              maxLength={6}
              placeholder="Enter OTP"
              className={`w-full p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border ${
                otpVerified ? "border-green-500" : otpError ? "border-red-500" : "border-gray-500"
              } focus:border-yellow-400`}
            />
            {/* ✅ Green tick inside input */}
            {otpVerified && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold">
                ✓
              </div>
            )}
          </div>
          {/* Status messages */}
          {isVerifyingOtp && <p className="text-xs text-blue-400 mt-1">Verifying...</p>}
          {otpError && !isVerifyingOtp && <p className="text-xs text-red-400 mt-1">{otpError}</p>}
        </div>

        {/* New Password */}
        <div className="mb-4 sm:mb-6 relative">
          <label htmlFor="new_password" className="block text-xs sm:text-sm font-medium mb-1">New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="new_password"
            onChange={handleChange}
            value={form.new_password}
            placeholder="Enter your new password"
            className="w-full p-2 sm:p-3 pr-10 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
          />
          <button
            type="button"
            className="absolute right-3 top-8 sm:top-9 text-gray-300 hover:text-yellow-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Reset Password Button */}
        <button
          onClick={handleResetPassword}
          disabled={!otpVerified}
          className={`w-full font-semibold py-2.5 sm:py-3 text-sm rounded-lg transition-all duration-300 ${
            otpVerified
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
