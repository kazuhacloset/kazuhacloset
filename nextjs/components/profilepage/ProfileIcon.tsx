'use client';

import { useEffect, useState } from 'react';

const ProfileIcon = () => {
  const [initial, setInitial] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('first_name');

    if (name) {
      setInitial(name.charAt(0).toUpperCase());
      setFullName(name);
    }
  }, []);

  if (!initial) return null;

  return (
    <div
      title={fullName}
      className="group relative flex items-center justify-center cursor-pointer"
    >
      {/* Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FF6B00]/30 to-[#E11D48]/30 blur-xl opacity-70 transition-all duration-500 group-hover:scale-125 group-hover:opacity-100" />

      {/* Outer Gradient Ring */}
      <div className="relative p-[2px] rounded-full bg-gradient-to-br from-[#FF6B00] via-[#FF8A00] to-[#E11D48] shadow-[0_0_25px_rgba(255,107,0,0.28)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(255,107,0,0.45)]">

        {/* Inner Circle */}
        <div
          className="
            w-11 h-11 sm:w-12 sm:h-12
            rounded-full
            bg-gradient-to-br
            from-[#111111]
            via-[#18181B]
            to-[#050505]
            border border-white/10
            flex items-center justify-center
            text-[#F5F5F5]
            font-black
            text-lg sm:text-xl
            tracking-wide
            backdrop-blur-xl
            transition-all duration-500
            group-hover:text-white
          "
          style={{
            textShadow: '0 0 14px rgba(255,107,0,0.35)',
          }}
        >
          {initial}
        </div>
      </div>

      {/* Hover Shine */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.18),transparent)] translate-x-[-120%] group-hover:translate-x-[120%]" />
      </div>
    </div>
  );
};

export default ProfileIcon;