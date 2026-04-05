'use client';

import React from 'react';

interface ThankYouSectionProps {
  orderNumber?: string;
}

export function ThankYouSection({ orderNumber }: ThankYouSectionProps) {
  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-8 text-center bg-gradient-to-b from-white to-amber-50">
      {/* Main Header */}
      <div className="max-w-2xl mx-auto">
        {/* Coffee Icon */}
        <div className="mb-6 flex justify-center">
          <div className="text-5xl md:text-6xl">☕️</div>
        </div>

        {/* Primary Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-amber-950 mb-4 leading-tight">
          Thank you for choosing The Barista! ☕️
        </h1>

        {/* Order Number */}
        {orderNumber && (
          <p className="text-sm md:text-base text-amber-800 font-semibold mb-6 tracking-wider">
            Order #{orderNumber}
          </p>
        )}

        {/* Subtext */}
        <p className="text-base md:text-lg text-amber-900 leading-relaxed mb-8 font-light max-w-xl mx-auto">
          Your order has been received. Our team is now crafting your perfect cup of coffee. We'll have it delivered to you shortly.
        </p>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-300" />
          <div className="text-amber-700 text-xl">✓</div>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-300" />
        </div>

        {/* Reassurance Message */}
        <p className="text-xs md:text-sm text-amber-700 italic">
          You will receive a call or SMS when your order is on the way
        </p>
      </div>

      {/* Accent Line Below */}
      <div className="mt-12 pt-6 border-t-2 border-amber-200" />
    </section>
  );
}
