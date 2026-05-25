'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  sendForgotOtp,
  verifyForgotOtp,
  resetPassword,
} from '@/utils/api/userUtils';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
  const [otpError, setOtpError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!form.email) {
      toast.error('Please enter your email first');
      return;
    }

    try {
      setIsSendingOtp(true);

      const res = await sendForgotOtp(form.email);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message || 'OTP sent successfully!');
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Auto verify OTP
  useEffect(() => {
    const verify = async () => {
      if (form.email && form.otp.length === 6 && !otpVerified) {
        try {
          setIsVerifyingOtp(true);

          const res = await verifyForgotOtp(form.email, form.otp);

          if (res.verified) {
            setOtpVerified(true);
            setOtpError('');
            toast.success(res.message || 'OTP verified successfully!');
          } else {
            setOtpVerified(false);
            setOtpError('Invalid OTP');
            toast.error(res.error || 'Invalid OTP');
          }
        } catch {
          setOtpVerified(false);
          setOtpError('OTP verification failed');
          toast.error('OTP verification failed');
        } finally {
          setIsVerifyingOtp(false);
        }
      }
    };

    verify();
  }, [form.otp, form.email, otpVerified]);

  // Reset Password
  const handleResetPassword = async () => {
    if (!otpVerified) {
      setOtpError('Please enter a valid 6-digit OTP');
      toast.error('Please verify OTP first');
      return;
    }

    if (!form.new_password) {
      toast.error('Please enter a new password');
      return;
    }

    try {
      const res = await resetPassword(
        form.email,
        form.new_password
      );

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      toast.success(res.message || 'Password reset successful!');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch {
      toast.error('Failed to reset password');
    }
  };

  // Enter key support
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleResetPassword();
    }
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      className="relative min-h-screen overflow-hidden bg-[#050505] flex items-center justify-center px-4 py-10"
    >
      {/* Background Image */}
      <Image
        src="/background.jpg"
        alt="background"
        fill
        priority
        className="object-cover opacity-20"
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,107,0,0.18),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(225,29,72,0.15),transparent_35%)]" />

      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:45px_45px]" />

      {/* Floating Glow */}
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] rounded-full bg-[#FF6B00]/20 blur-[120px]" />
      <div className="absolute bottom-[-120px] right-[-80px] w-[320px] h-[320px] rounded-full bg-[#E11D48]/20 blur-[120px]" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Outer Glow */}
        <div className="absolute -inset-[1px] rounded-[30px] bg-gradient-to-br from-[#FF6B00]/40 via-transparent to-[#E11D48]/40 blur-sm opacity-80" />

        {/* Main Card */}
        <div className="relative rounded-[30px] border border-white/10 bg-[#111111]/75 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Top Ambient Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-70" />

          <div className="px-6 sm:px-10 py-10 sm:py-12">
            
            {/* Heading */}
            <div className="text-center mb-10">
              <p className="text-[#FF6B00] uppercase tracking-[0.35em] text-[10px] sm:text-xs mb-3 font-medium">
                Account Recovery
              </p>

              <h1 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] tracking-tight leading-tight">
                Forgot
                <span className="bg-gradient-to-r from-[#FF6B00] to-[#E11D48] bg-clip-text text-transparent">
                  {' '}
                  Password
                </span>
              </h1>

              <p className="text-[#A1A1AA] text-sm mt-4 leading-relaxed max-w-sm mx-auto">
                Recover access to your premium anime streetwear account securely.
              </p>
            </div>

            {/* EMAIL */}
            <div className="mb-6">
              <label className="block text-sm text-[#D4D4D8] mb-2 font-medium tracking-wide">
                Email Address
              </label>

              <div className="flex gap-2">
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="flex-1 h-12 rounded-xl bg-[#18181B]/90 border border-white/10 px-4 text-sm text-white placeholder:text-[#71717A] outline-none transition-all duration-300 focus:border-[#FF6B00]/70 focus:shadow-[0_0_20px_rgba(255,107,0,0.18)]"
                />

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="relative overflow-hidden px-5 h-12 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#FF6B00] to-[#E11D48] transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(255,107,0,0.45)] active:scale-[0.98]"
                >
                  {isSendingOtp ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>

            {/* OTP */}
            <div className="mb-6">
              <label className="block text-sm text-[#D4D4D8] mb-2 font-medium tracking-wide">
                Verification OTP
              </label>

              <div className="relative">
                <input
                  type="text"
                  id="otp"
                  value={form.otp}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6);

                    setForm({
                      ...form,
                      otp: value,
                    });

                    if (value.length < 6) {
                      setOtpError('OTP must be 6 digits');
                      setOtpVerified(false);
                    } else {
                      setOtpError('');
                    }
                  }}
                  className={`w-full h-12 rounded-xl bg-[#18181B]/90 border px-4 pr-12 text-sm text-white placeholder:text-[#71717A] outline-none transition-all duration-300
                  ${
                    otpVerified
                      ? 'border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.18)]'
                      : otpError
                      ? 'border-red-500'
                      : 'border-white/10 focus:border-[#FF6B00]/70 focus:shadow-[0_0_20px_rgba(255,107,0,0.18)]'
                  }`}
                />

                {otpVerified && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400">
                    <CheckCircle2 size={20} />
                  </div>
                )}
              </div>

              {isVerifyingOtp && (
                <p className="text-xs text-[#60A5FA] mt-2">
                  Verifying OTP...
                </p>
              )}

              {otpError && !isVerifyingOtp && (
                <p className="text-xs text-red-400 mt-2">
                  {otpError}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-8 relative">
              <label className="block text-sm text-[#D4D4D8] mb-2 font-medium tracking-wide">
                New Password
              </label>

              <input
                type={showPassword ? 'text' : 'password'}
                id="new_password"
                value={form.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full h-12 rounded-xl bg-[#18181B]/90 border border-white/10 px-4 pr-12 text-sm text-white placeholder:text-[#71717A] outline-none transition-all duration-300 focus:border-[#FF6B00]/70 focus:shadow-[0_0_20px_rgba(255,107,0,0.18)]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-[42px] text-[#A1A1AA] hover:text-[#FF6B00] transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* RESET BUTTON */}
            <button
              onClick={handleResetPassword}
              disabled={!otpVerified}
              className={`group relative w-full h-13 rounded-xl overflow-hidden font-semibold tracking-wide transition-all duration-500
              ${
                otpVerified
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#E11D48] text-white hover:shadow-[0_0_35px_rgba(255,107,0,0.35)] hover:scale-[1.01]'
                  : 'bg-[#27272A] text-[#71717A] cursor-not-allowed'
              }`}
            >
              <span className="relative z-10">
                Reset Password
              </span>

              {otpVerified && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] translate-x-[-100%] group-hover:translate-x-[100%]" />
              )}
            </button>

            {/* Bottom Text */}
            <div className="mt-8 text-center">
              <p className="text-xs text-[#71717A] tracking-wide">
                KAZUHA CLOSET — PREMIUM ANIME STREETWEAR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}