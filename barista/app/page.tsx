'use client';

import Link from 'next/link';
import { Button } from '@/components/common';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F4] to-[#EFE9DC] flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="text-7xl">☕</div>
        </div>

        {/* Branding */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A]">
            The Barista
          </h1>
          <p className="text-xl text-[#8E8680]">
            Premium Vietnamese Coffee, Delivered Fast
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-[#524D47] leading-relaxed">
          Indulge in expertly crafted Vietnamese coffee from the comfort of your office. 
          Browse our curated selection of premium drinks, customize your perfect cup, 
          and enjoy fresh delivery to your door.
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Link href="/menu">
            <Button variant="primary" size="lg" className="w-full md:w-auto min-w-[200px]">
              Start Ordering
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-8 text-left">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Fast Delivery</h3>
            <p className="text-sm text-[#8E8680]">Fresh coffee delivered in 15 minutes</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Customizable</h3>
            <p className="text-sm text-[#8E8680]">Perfect size, sugar, and ice levels</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">COD Payment</h3>
            <p className="text-sm text-[#8E8680]">Pay on delivery, no hassle</p>
          </div>
        </div>
      </div>
    </div>
  );
}
