'use client';

import React from 'react';

interface CallShopButtonProps {
  phoneNumber?: string;
  label?: string;
}

export function CallShopButton({ 
  phoneNumber = '+84239100000',
  label = 'Call Shop for Support'
}: CallShopButtonProps) {
  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <button
      onClick={handleCall}
      className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 
        bg-amber-700 hover:bg-amber-800 active:bg-amber-900
        text-white font-semibold rounded-lg
        transition-colors duration-200
        flex items-center justify-center gap-2
        shadow-md hover:shadow-lg
        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      aria-label={label}
      title="Call the shop for support"
    >
      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
