'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  hint,
  disabled = false,
  required = false,
  className = '',
  type = 'text',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
          {label}
          {required && <span className="text-[#DC2626] ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md text-base transition-colors focus:outline-none focus:ring-2 focus:ring-[#8B6F47] focus:ring-offset-0 ${
          error ? 'border-[#DC2626] focus:ring-[#DC2626]' : 'border-[#E8E3D9] hover:border-[#DDD7CB]'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#F2EFE9]' : 'bg-white'} ${className}`}
        {...props}
      />
      {error && <p className="text-[#DC2626] text-sm mt-1">{error}</p>}
      {hint && !error && <p className="text-[#8E8680] text-sm mt-1">{hint}</p>}
    </div>
  );
}
