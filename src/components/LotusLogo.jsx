import React from 'react';

export default function LotusLogo({ size = 32, className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lotusGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="lotusCenter" x1="24" y1="12" x2="24" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#bae6fd" />
        </linearGradient>
      </defs>

      {/* Outer base petal glow */}
      <path 
        d="M24 40C14 40 6 32 6 24C6 19 10 14 14 12C12 18 16 26 24 30C32 26 36 18 34 12C38 14 42 19 42 24C42 32 34 40 24 40Z" 
        fill="url(#lotusGrad)" 
        opacity="0.4"
      />
      {/* Left Outer Petal */}
      <path 
        d="M24 36C16 36 10 28 8 20C12 16 18 16 22 22C24 25 24 32 24 36Z" 
        fill="url(#lotusGrad)" 
        opacity="0.75"
      />
      {/* Right Outer Petal */}
      <path 
        d="M24 36C32 36 38 28 40 20C36 16 30 16 26 22C24 25 24 32 24 36Z" 
        fill="url(#lotusGrad)" 
        opacity="0.75"
      />
      {/* Left Mid Petal */}
      <path 
        d="M24 37C18 37 14 30 13 22C17 17 21 16 23 20C24 22 24 33 24 37Z" 
        fill="url(#lotusGrad)" 
        opacity="0.9"
      />
      {/* Right Mid Petal */}
      <path 
        d="M24 37C30 37 34 30 35 22C31 17 27 16 25 20C24 22 24 33 24 37Z" 
        fill="url(#lotusGrad)" 
        opacity="0.9"
      />
      {/* Center Main Petal */}
      <path 
        d="M24 6C20 16 18 26 24 38C30 26 28 16 24 6Z" 
        fill="url(#lotusCenter)"
      />
      {/* Base water line arc */}
      <path 
        d="M12 42C18 45 30 45 36 42" 
        stroke="#38bdf8" 
        strokeWidth="2" 
        strokeLinecap="round" 
        opacity="0.8"
      />
    </svg>
  );
}
