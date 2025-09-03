'use client';

import React, { useState } from 'react';
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
    } catch (err: unknown) {
      toast.error("Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async () => {
    if (!form.email || !form.otp) {
      toast.error("Please enter your email and OTP");
      return;
    }
    try {
      setIsVerifyingOtp(true);
      const res = await verifyForgotOtp(form.email, form.otp);
      if (res.verified) {
        setOtpVerified(true);
        toast.success(res.message || "OTP verified!");
      } else {
        toast.error(res.error || "Invalid OTP");
      }
    } catch {
      toast.error("OTP verification failed");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    if (!otpVerified) {
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

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          <div className="flex gap-2">
            <input
              type="email"
              id="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Enter your email"
              className="flex-1 p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isSendingOtp}
              className="bg-yellow-400 text-black px-3 sm:px-4 rounded-lg hover:bg-yellow-300 transition text-sm py-2 sm:py-3"
            >
              {isSendingOtp ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </div>

        {/* OTP + Verify */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="otp" className="block text-xs sm:text-sm font-medium mb-1">Verification OTP</label>
          <div className="flex gap-2">
            <input
              type="text"
              id="otp"
              onChange={handleChange}
              value={form.otp}
              placeholder="Enter OTP"
              className="flex-1 p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp}
              className={`px-3 sm:px-4 rounded-lg text-sm py-2 sm:py-3 transition ${
                otpVerified
                  ? "bg-green-500 text-white"
                  : "bg-blue-400 text-black hover:bg-blue-300"
              }`}
            >
              {otpVerified ? "Verified" : isVerifyingOtp ? "Verifying..." : "Verify"}
            </button>
          </div>
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
