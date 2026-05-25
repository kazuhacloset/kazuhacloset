'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { userLogin } from '@/utils/api/userUtils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface LoginResponse {
  token?: string;
  error?: string;
  message?: string;
  detail?: string;
  data?: unknown;
}

interface ApiError {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const friendlyErrorFrom = (payload: unknown, status?: number): string => {
    const raw =
      (typeof payload === 'object' &&
        payload !== null &&
        ('error' in payload || 'message' in payload || 'detail' in payload) &&
        ((payload as { error?: string; message?: string; detail?: string }).error ||
          (payload as { error?: string; message?: string; detail?: string }).message ||
          (payload as { error?: string; message?: string; detail?: string }).detail))?.toString() || '';
    const msg = raw.toLowerCase();
    if (status === 401 || msg.includes('invalid') || msg.includes('credentials') || msg.includes('unauthor'))
      return 'Incorrect email or password';
    if (msg.includes('password')) return 'Incorrect password';
    if (msg.includes('not found') || msg.includes('no user') || msg.includes('email'))
      return 'No account found with this email';
    if (raw) return raw;
    return 'Login failed, please check your credentials';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in both email and password');
      return;
    }
    setLoading(true);
    try {
      const res: LoginResponse = await userLogin(form);
      const data = (res as { data?: LoginResponse }).data ?? res;
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        toast.success('Login Successful');
        setTimeout(() => router.push('/'), 1500);
        return;
      }
      if (data && (data.error || data.message || data.detail)) {
        toast.error(friendlyErrorFrom(data));
        return;
      }
      toast.error('Login failed, please check your credentials');
    } catch (err: unknown) {
      const apiErr = err as ApiError;
      toast.error(friendlyErrorFrom(apiErr.response?.data ?? err, apiErr.response?.status));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@300;400;500;600;700&family=Inter:wght@300;400;500&display=swap');

        .kc-root {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Dark cinematic overlay on top of background image */
        .kc-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 70% 60% at 20% 50%, rgba(255,107,0,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 80% 20%, rgba(225,29,72,0.15) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(0,0,0,0.6) 0%, transparent 60%),
            linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.4) 50%, rgba(5,5,5,0.65) 100%);
        }

        /* Subtle grid over image */
        .kc-grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          background-image:
            linear-gradient(rgba(255,107,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,0,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Floating particles */
        .kc-particles {
          position: absolute;
          inset: 0;
          z-index: 3;
          overflow: hidden;
          pointer-events: none;
        }

        .kc-particle {
          position: absolute;
          width: 1px;
          height: 1px;
          background: rgba(255,107,0,0.6);
          border-radius: 50%;
          animation: kc-float linear infinite;
        }
        .kc-particle:nth-child(1)  { left:10%; animation-duration:18s; animation-delay:0s;  width:2px; height:2px; }
        .kc-particle:nth-child(2)  { left:25%; animation-duration:24s; animation-delay:3s; }
        .kc-particle:nth-child(3)  { left:40%; animation-duration:20s; animation-delay:7s; width:2px; height:2px; background:rgba(225,29,72,0.5); }
        .kc-particle:nth-child(4)  { left:60%; animation-duration:26s; animation-delay:1s; }
        .kc-particle:nth-child(5)  { left:75%; animation-duration:22s; animation-delay:5s; width:2px; height:2px; }
        .kc-particle:nth-child(6)  { left:88%; animation-duration:19s; animation-delay:9s; background:rgba(225,29,72,0.5); }
        .kc-particle:nth-child(7)  { left:50%; animation-duration:30s; animation-delay:2s; width:3px; height:3px; background:rgba(255,107,0,0.35); }
        .kc-particle:nth-child(8)  { left:15%; animation-duration:21s; animation-delay:12s; }
        .kc-particle:nth-child(9)  { left:70%; animation-duration:25s; animation-delay:6s; width:2px; height:2px; }
        .kc-particle:nth-child(10) { left:35%; animation-duration:17s; animation-delay:4s; background:rgba(225,29,72,0.35); }

        @keyframes kc-float {
          0%   { transform:translateY(110vh) translateX(0px);  opacity:0; }
          5%   { opacity:1; }
          95%  { opacity:1; }
          100% { transform:translateY(-10vh) translateX(20px); opacity:0; }
        }

        /* ── TRUE GLASS CARD ── */
        .kc-card {
          position: relative;
          z-index: 10;
          width: 95%;
          max-width: 440px;

          /* Glass effect — shows blurred background image through */
          background: rgba(10, 10, 14, 0.45);
          backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4);

          border: 1px solid rgba(255, 107, 0, 0.22);
          border-radius: 6px;
          padding: 48px 40px 56px;

          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 80px rgba(255,107,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.08);

          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .kc-card:hover {
          border-color: rgba(255,107,0,0.38);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 40px 80px rgba(0,0,0,0.65),
            0 0 100px rgba(255,107,0,0.12),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* Top accent glow line */
        .kc-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,107,0,0.7), rgba(225,29,72,0.5), transparent);
          border-radius: 0 0 4px 4px;
        }

        /* Corner bracket top-right */
        .kc-card::after {
          content: '';
          position: absolute;
          top: -1px;
          right: -1px;
          width: 28px;
          height: 28px;
          border-top: 1px solid rgba(255,107,0,0.6);
          border-right: 1px solid rgba(255,107,0,0.6);
          border-radius: 0 6px 0 0;
        }

        /* Brand */
        .kc-brand {
          text-align: center;
          margin-bottom: 36px;
        }

        .kc-brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 0.42em;
          color: rgba(255,107,0,0.75);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .kc-heading {
          font-family: 'Rajdhani', sans-serif;
          font-size: 38px;
          font-weight: 700;
          color: #F5F5F5;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
          margin: 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .kc-heading span {
          background: linear-gradient(135deg, #FF6B00, #E11D48);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .kc-subtext {
          font-size: 10px;
          color: rgba(245,245,245,0.4);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-top: 8px;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Fields */
        .kc-field { margin-bottom: 20px; }

        .kc-label {
          display: block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.55);
          margin-bottom: 8px;
        }

        .kc-input {
          width: 100%;
          padding: 13px 16px;
          background: rgba(5,5,8,0.55);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 3px;
          color: #F5F5F5;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          font-weight: 300;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          box-sizing: border-box;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .kc-input::placeholder {
          color: rgba(245,245,245,0.2);
          font-size: 13px;
        }

        .kc-input:hover {
          border-color: rgba(255,107,0,0.25);
          background: rgba(8,8,12,0.6);
        }

        .kc-input:focus {
          border-color: rgba(255,107,0,0.55);
          background: rgba(10,10,15,0.7);
          box-shadow: 0 0 0 3px rgba(255,107,0,0.07), inset 0 1px 0 rgba(255,255,255,0.03);
        }

        .kc-pass-wrap { position: relative; }
        .kc-pass-wrap .kc-input { padding-right: 46px; }

        .kc-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(245,245,245,0.35);
          display: flex;
          align-items: center;
          transition: color 0.2s ease;
          padding: 0;
        }
        .kc-eye-btn:hover { color: rgba(255,107,0,0.85); }

        .kc-forgot {
          display: block;
          text-align: right;
          margin-top: 6px;
          margin-bottom: 28px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,107,0,0.5);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .kc-forgot:hover { color: rgba(255,107,0,1); }

        /* Button */
        .kc-btn {
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #FF6B00 0%, #E11D48 100%);
          border: none;
          border-radius: 3px;
          color: #F5F5F5;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.2s ease;
        }

        .kc-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .kc-btn:hover::before { opacity: 1; }
        .kc-btn:hover {
          box-shadow: 0 8px 32px rgba(255,107,0,0.4), 0 0 0 1px rgba(255,107,0,0.25);
          transform: translateY(-1px);
        }
        .kc-btn:active { transform: translateY(0); }
        .kc-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .kc-footer {
          text-align: center;
          font-size: 12px;
          color: rgba(245,245,245,0.4);
          letter-spacing: 0.02em;
          margin-top: 22px;
          font-family: 'Inter', sans-serif;
        }
        .kc-footer a {
          color: rgba(255,107,0,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .kc-footer a:hover { color: #FF6B00; }

        /* Scanline */
        .kc-scanline {
          position: absolute;
          bottom: 18px;
          left: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.3;
          pointer-events: none;
        }
        .kc-scanline-dot { width:3px; height:3px; background:rgba(255,107,0,0.9); border-radius:50%; flex-shrink:0; }
        .kc-scanline-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(255,107,0,0.5),transparent); }
        .kc-scanline-text { font-family:'Rajdhani',sans-serif; font-size:9px; letter-spacing:0.3em; color:rgba(255,107,0,0.7); text-transform:uppercase; white-space:nowrap; }

        @media (max-width: 480px) {
          .kc-card { padding: 36px 22px 48px; }
          .kc-heading { font-size: 30px; }
        }
      `}</style>

      <div className="kc-root">
        {/* Background image */}
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Cinematic overlay */}
        <div className="kc-overlay" />
        <div className="kc-grid" />

        {/* Particles */}
        <div className="kc-particles">
          {[...Array(10)].map((_, i) => <div key={i} className="kc-particle" />)}
        </div>

        {/* Glass Card */}
        <div className="kc-card">
          <div className="kc-brand">
            <div className="kc-brand-name">Kazuha Closet</div>
            <h1 className="kc-heading">Enter the <span>Realm</span></h1>
            <div className="kc-subtext">Access your wardrobe</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="kc-field">
              <label htmlFor="email" className="kc-label">Email</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="kc-input"
                required
              />
            </div>

            <div className="kc-field">
              <label htmlFor="password" className="kc-label">Password</label>
              <div className="kc-pass-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  className="kc-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="kc-eye-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Link href="/forgot-password" className="kc-forgot">
              Forgot Password?
            </Link>

            <button type="submit" disabled={loading} className="kc-btn">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Enter the Closet'}
            </button>
          </form>

          <p className="kc-footer">
            New to the universe?{' '}
            <Link href="/register">Create account</Link>
          </p>

          <div className="kc-scanline">
            <div className="kc-scanline-dot" />
            <div className="kc-scanline-line" />
            <div className="kc-scanline-text">KC–2077</div>
            <div className="kc-scanline-line" style={{ background: 'linear-gradient(270deg,rgba(255,107,0,0.5),transparent)' }} />
            <div className="kc-scanline-dot" />
          </div>
        </div>
      </div>
    </>
  );
}