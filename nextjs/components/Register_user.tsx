'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userRegister, sendOtp, verifyOtp } from '@/utils/api/userUtils';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    otp: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!form.email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      setIsSendingOtp(true);
      const res = await sendOtp(form.email);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message || "OTP sent successfully!");
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        toast.error(axiosErr.response?.data?.error || "Failed to send OTP");
      } else {
        toast.error("Failed to send OTP");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !form.otp) {
      toast.error("Please enter your email and OTP first");
      return;
    }
    try {
      setIsVerifyingOtp(true);
      const res = await verifyOtp(form.email, form.otp);
      if (res.verified) {
        setOtpVerified(true);
        toast.success(res.message || "OTP verified successfully!");
      } else {
        setOtpVerified(false);
        toast.error(res.error || "Invalid OTP");
      }
    } catch (err: unknown) {
      setOtpVerified(false);
      if (typeof err === 'object' && err && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        toast.error(axiosErr.response?.data?.error || "OTP verification failed");
      } else {
        toast.error("OTP verification failed");
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleRegister = async () => {
    try {
      const res = await userRegister(form);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res && res.token) {
        localStorage.setItem('token', res.token);
        toast.success('Registration successful!');
        setTimeout(() => router.push('/'), 1500);
      } else {
        toast.error('Registration failed.');
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        toast.error(axiosErr.response?.data?.error || 'Something went wrong!');
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        priority
        className="object-cover z-0"
      />

      {/* Form Content */}
      <div className="relative z-10 bg-black/30 backdrop-blur-md border border-transparent rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:border-white transition-all duration-500 ease-in-out transform hover:scale-105 w-[95%] sm:w-[90%] md:max-w-md px-3 py-4 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Register</h2>

        {/* First Name */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="first_name" className="block text-xs sm:text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            id="first_name"
            onChange={handleChange}
            value={form.first_name}
            placeholder="Enter your first name"
            className="w-full p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
          />
        </div>

        {/* Last Name */}
        <div className="mb-3 sm:mb-4">
          <label htmlFor="last_name" className="block text-xs sm:text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            id="last_name"
            onChange={handleChange}
            value={form.last_name}
            placeholder="Enter your last name"
            className="w-full p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
          />
        </div>

        {/* Email with Send OTP */}
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

        {/* OTP Field + Verify Button */}
        <div className="mb-4 sm:mb-6">
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

        {/* Password */}
        <div className="mb-4 sm:mb-6 relative">
          <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            onChange={handleChange}
            value={form.password}
            placeholder="Enter your password"
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

        {/* Submit Button */}
        <button
          onClick={handleRegister}
          disabled={!otpVerified}
          className={`w-full font-semibold py-2.5 sm:py-3 text-sm rounded-lg transition-all duration-300 ${
            otpVerified
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-gray-500 text-gray-300 cursor-not-allowed"
          }`}
        >
          Register
        </button>

        {/* Login link */}
        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-white">
          Already registered?{' '}
          <Link href="/login" className="text-yellow-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
