'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userLogin } from '@/utils/api/userUtils';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // 👈 Loader2 for spinner
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 loading state

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error('Please fill in both email and password');
      return;
    }

    setLoading(true); // 👈 start spinner
    try {
      const res = await userLogin(form);
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        toast.success("Login Successful");
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        toast.error('Login failed, please check your credentials');
      }
    } catch {
      toast.error('Something went wrong!');
    } finally {
      setLoading(false); // 👈 stop spinner
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

      {/* Login Form */}
      <div className="relative z-10 bg-black/30 backdrop-blur-md border border-transparent 
        rounded-2xl shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] hover:border-white 
        transition-all duration-500 ease-in-out transform hover:scale-105
        w-[95%] sm:w-[90%] md:max-w-md
        px-3 py-4 sm:px-6 sm:py-8 md:px-8 md:py-10 text-white"
      >
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-3 sm:mb-4">
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 sm:p-3 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-2 sm:mb-3 relative">
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-2 sm:p-3 pr-10 text-sm rounded-lg bg-black/40 placeholder-gray-300 text-white outline-none border border-gray-500 focus:border-yellow-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 sm:top-9 text-gray-300 hover:text-yellow-400"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <Link href="/forgot-password" className="text-yellow-400 hover:underline text-xs sm:text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-2.5 sm:py-3 text-sm rounded-lg 
              hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} /> // 👈 spinner here
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Register Redirect */}
        <p className="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-white">
          Not registered?{' '}
          <Link href="/register" className="text-yellow-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
