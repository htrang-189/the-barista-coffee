'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses =
    'font-medium rounded-md transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#1A1A1A] text-white hover:bg-[#333333] active:bg-[#1A1A1A] focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2',
    secondary:
      'bg-[#8B6F47] text-white hover:bg-[#9d7d56] active:bg-[#7b6242] focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2',
    outline:
      'border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10 focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2',
    ghost: 'text-[#1A1A1A] hover:bg-[#1A1A1A]/5 active:bg-[#1A1A1A]/10 focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-2',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm min-h-[32px]',
    md: 'px-4 py-2.5 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
