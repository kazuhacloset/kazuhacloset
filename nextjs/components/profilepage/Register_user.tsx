'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { userRegister, sendOtp, verifyOtp } from '@/utils/api/userUtils';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  const [isRegistering, setIsRegistering] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!form.email) { toast.error('Please enter your email first'); return; }
    try {
      setIsSendingOtp(true);
      const res = await sendOtp(form.email);
      if (res?.error) { toast.error(res.error); return; }
      toast.success(res.message || 'OTP sent successfully!');
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  useEffect(() => {
    const verify = async () => {
      if (form.email && form.otp.length === 6 && !otpVerified) {
        try {
          setIsVerifyingOtp(true);
          const res = await verifyOtp(form.email, form.otp);
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

  const handleRegister = async () => {
    if (!otpVerified) {
      setOtpError('Please enter a valid 6-digit OTP');
      toast.error('Please verify OTP first');
      return;
    }
    try {
      setIsRegistering(true);
      const res = await userRegister(form);
      if (res?.error) {
        toast.error(res.error.toLowerCase().includes('already') ? 'Email already registered' : res.error);
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
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } };
        if (axiosErr.response?.data?.error?.toLowerCase().includes('already')) {
          toast.error('Email already registered');
          return;
        }
      }
      toast.error('Something went wrong!');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); handleRegister(); }
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
          padding: 24px 0;
        }

        /* Cinematic overlay over bg image */
        .kc-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            radial-gradient(ellipse 70% 60% at 80% 30%, rgba(225,29,72,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 20% 70%, rgba(255,107,0,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 50% 0%, rgba(0,0,0,0.5) 0%, transparent 60%),
            linear-gradient(180deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.38) 50%, rgba(5,5,5,0.65) 100%);
        }

        .kc-grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          background-image:
            linear-gradient(rgba(225,29,72,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(225,29,72,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

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
        .kc-particle:nth-child(1)  { left:8%;  animation-duration:20s; animation-delay:0s;  width:2px; height:2px; }
        .kc-particle:nth-child(2)  { left:22%; animation-duration:25s; animation-delay:4s; }
        .kc-particle:nth-child(3)  { left:38%; animation-duration:18s; animation-delay:8s; width:2px; height:2px; background:rgba(225,29,72,0.5); }
        .kc-particle:nth-child(4)  { left:55%; animation-duration:28s; animation-delay:2s; }
        .kc-particle:nth-child(5)  { left:72%; animation-duration:23s; animation-delay:6s; width:2px; height:2px; }
        .kc-particle:nth-child(6)  { left:90%; animation-duration:21s; animation-delay:10s; background:rgba(225,29,72,0.5); }
        .kc-particle:nth-child(7)  { left:45%; animation-duration:32s; animation-delay:3s; width:3px; height:3px; background:rgba(255,107,0,0.3); }
        .kc-particle:nth-child(8)  { left:18%; animation-duration:22s; animation-delay:14s; }
        .kc-particle:nth-child(9)  { left:65%; animation-duration:27s; animation-delay:7s; width:2px; height:2px; }
        .kc-particle:nth-child(10) { left:33%; animation-duration:19s; animation-delay:5s; background:rgba(225,29,72,0.35); }

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
          max-width: 460px;

          background: rgba(10, 8, 14, 0.45);
          backdrop-filter: blur(28px) saturate(1.4);
          -webkit-backdrop-filter: blur(28px) saturate(1.4);

          border: 1px solid rgba(225,29,72,0.22);
          border-radius: 6px;
          padding: 44px 40px 52px;

          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 40px 80px rgba(0,0,0,0.6),
            0 0 80px rgba(225,29,72,0.08),
            inset 0 1px 0 rgba(255,255,255,0.08);

          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        .kc-card:hover {
          border-color: rgba(225,29,72,0.38);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 40px 80px rgba(0,0,0,0.65),
            0 0 100px rgba(225,29,72,0.12),
            inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* Top crimson accent line */
        .kc-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(225,29,72,0.7), rgba(255,107,0,0.5), transparent);
        }

        /* Corner bracket top-left */
        .kc-card::after {
          content: '';
          position: absolute;
          top: -1px;
          left: -1px;
          width: 28px;
          height: 28px;
          border-top: 1px solid rgba(225,29,72,0.6);
          border-left: 1px solid rgba(225,29,72,0.6);
          border-radius: 6px 0 0 0;
        }

        /* Brand */
        .kc-brand { text-align: center; margin-bottom: 30px; }

        .kc-brand-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 0.42em;
          color: rgba(225,29,72,0.7);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .kc-heading {
          font-family: 'Rajdhani', sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #F5F5F5;
          letter-spacing: 0.04em;
          line-height: 1;
          text-transform: uppercase;
          margin: 0;
          text-shadow: 0 2px 20px rgba(0,0,0,0.5);
        }

        .kc-heading span {
          background: linear-gradient(135deg, #E11D48, #FF6B00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .kc-subtext {
          font-size: 10px;
          color: rgba(245,245,245,0.38);
          letter-spacing: 0.22em;
          text-transform: uppercase;
          margin-top: 8px;
          font-family: 'Rajdhani', sans-serif;
        }

        /* Two-column name row */
        .kc-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 18px;
        }

        .kc-field { margin-bottom: 18px; }
        .kc-field-no-mb { margin-bottom: 0; }

        .kc-label {
          display: block;
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,245,245,0.5);
          margin-bottom: 7px;
        }

        .kc-input {
          width: 100%;
          padding: 12px 14px;
          background: rgba(5,4,8,0.55);
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

        .kc-input::placeholder { color: rgba(245,245,245,0.18); font-size: 13px; }

        .kc-input:hover {
          border-color: rgba(225,29,72,0.25);
          background: rgba(8,6,12,0.6);
        }

        .kc-input:focus {
          border-color: rgba(225,29,72,0.5);
          background: rgba(10,8,15,0.7);
          box-shadow: 0 0 0 3px rgba(225,29,72,0.07), inset 0 1px 0 rgba(255,255,255,0.02);
        }

        .kc-input-verified {
          border-color: rgba(34,197,94,0.5) !important;
          box-shadow: 0 0 0 3px rgba(34,197,94,0.07) !important;
        }

        .kc-input-error {
          border-color: rgba(239,68,68,0.5) !important;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.06) !important;
        }

        /* Email + OTP button row */
        .kc-email-row { display: flex; gap: 10px; align-items: stretch; }
        .kc-email-row .kc-input { flex: 1; min-width: 0; }

        .kc-otp-btn {
          flex-shrink: 0;
          padding: 0 14px;
          background: rgba(225,29,72,0.1);
          border: 1px solid rgba(225,29,72,0.28);
          border-radius: 3px;
          color: rgba(225,29,72,0.9);
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
          min-height: 40px;
          backdrop-filter: blur(8px);
        }
        .kc-otp-btn:hover {
          background: rgba(225,29,72,0.22);
          border-color: rgba(225,29,72,0.55);
          color: #E11D48;
        }
        .kc-otp-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .kc-otp-wrap { position: relative; }

        .kc-otp-status {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(34,197,94,0.85);
          color: white;
          font-size: 10px;
          font-weight: 700;
        }

        .kc-hint { font-family: 'Inter', sans-serif; font-size: 11px; margin-top: 5px; }
        .kc-hint-verifying { color: rgba(96,165,250,0.7); }
        .kc-hint-error { color: rgba(239,68,68,0.7); }

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
        .kc-eye-btn:hover { color: rgba(225,29,72,0.85); }

        /* CTA */
        .kc-btn {
          width: 100%;
          padding: 15px 24px;
          background: linear-gradient(135deg, #E11D48 0%, #FF6B00 100%);
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
          margin-top: 8px;
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
          box-shadow: 0 8px 32px rgba(225,29,72,0.4), 0 0 0 1px rgba(225,29,72,0.25);
          transform: translateY(-1px);
        }
        .kc-btn:active { transform: translateY(0); }
        .kc-btn:disabled {
          background: rgba(30,25,30,0.7);
          color: rgba(245,245,245,0.3);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .kc-btn:disabled::before { display: none; }

        .kc-footer {
          text-align: center;
          font-size: 12px;
          color: rgba(245,245,245,0.38);
          letter-spacing: 0.02em;
          margin-top: 20px;
          font-family: 'Inter', sans-serif;
        }
        .kc-footer a {
          color: rgba(225,29,72,0.8);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .kc-footer a:hover { color: #E11D48; }

        /* Scanline */
        .kc-scanline {
          position: absolute;
          bottom: 16px;
          left: 24px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.28;
          pointer-events: none;
        }
        .kc-scanline-dot { width:3px; height:3px; background:rgba(225,29,72,0.9); border-radius:50%; flex-shrink:0; }
        .kc-scanline-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(225,29,72,0.5),transparent); }
        .kc-scanline-text { font-family:'Rajdhani',sans-serif; font-size:9px; letter-spacing:0.3em; color:rgba(225,29,72,0.7); text-transform:uppercase; white-space:nowrap; }

        @media (max-width: 480px) {
          .kc-card { padding: 32px 20px 48px; }
          .kc-heading { font-size: 28px; }
          .kc-row { grid-template-columns: 1fr; gap: 0; }
          .kc-row .kc-field-no-mb { margin-bottom: 18px; }
        }
      `}</style>

      <div className="kc-root" onKeyDown={handleKeyDown}>
        {/* Background image */}
        <Image
          src="/background.jpg"
          alt="Background"
          fill
          priority
          className="object-cover"
          style={{ zIndex: 0 }}
        />

        {/* Cinematic overlays */}
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
            <h1 className="kc-heading">Join the <span>Universe</span></h1>
            <div className="kc-subtext">Create your wardrobe identity</div>
          </div>

          {/* Name row */}
          <div className="kc-row">
            <div className="kc-field kc-field-no-mb">
              <label htmlFor="first_name" className="kc-label">First Name</label>
              <input type="text" id="first_name" value={form.first_name} onChange={handleChange} placeholder="Kazuha" className="kc-input" />
            </div>
            <div className="kc-field kc-field-no-mb">
              <label htmlFor="last_name" className="kc-label">Last Name</label>
              <input type="text" id="last_name" value={form.last_name} onChange={handleChange} placeholder="Kaedehara" className="kc-input" />
            </div>
          </div>

          {/* Email + OTP */}
          <div className="kc-field">
            <label htmlFor="email" className="kc-label">Email</label>
            <div className="kc-email-row">
              <input type="email" id="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="kc-input" />
              <button type="button" onClick={handleSendOtp} disabled={isSendingOtp} className="kc-otp-btn">
                {isSendingOtp ? <Loader2 size={14} className="animate-spin" /> : 'Send OTP'}
              </button>
            </div>
          </div>

          {/* OTP */}
          <div className="kc-field">
            <label htmlFor="otp" className="kc-label">Verification Code</label>
            <div className="kc-otp-wrap">
              <input
                type="text"
                id="otp"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setForm({ ...form, otp: value });
                  if (value.length < 6) { setOtpError('OTP must be 6 digits'); setOtpVerified(false); }
                  else setOtpError('');
                }}
                value={form.otp}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={`kc-input ${otpVerified ? 'kc-input-verified' : otpError ? 'kc-input-error' : ''}`}
                style={{ paddingRight: otpVerified ? '46px' : '14px' }}
              />
              {otpVerified && <div className="kc-otp-status">✓</div>}
            </div>
            {isVerifyingOtp && <p className="kc-hint kc-hint-verifying">Verifying code...</p>}
            {otpError && !isVerifyingOtp && <p className="kc-hint kc-hint-error">{otpError}</p>}
          </div>

          {/* Password */}
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
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="kc-eye-btn" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleRegister} disabled={!otpVerified || isRegistering} className="kc-btn">
            {isRegistering ? <Loader2 size={18} className="animate-spin" /> : 'Create Identity'}
          </button>

          <p className="kc-footer">
            Already a member?{' '}
            <Link href="/login">Sign in here</Link>
          </p>

          <div className="kc-scanline">
            <div className="kc-scanline-dot" />
            <div className="kc-scanline-line" />
            <div className="kc-scanline-text">KC–INIT</div>
            <div className="kc-scanline-line" style={{ background: 'linear-gradient(270deg,rgba(225,29,72,0.5),transparent)' }} />
            <div className="kc-scanline-dot" />
          </div>
        </div>
      </div>
    </>
  );
}