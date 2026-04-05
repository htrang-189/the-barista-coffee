'use client';

import React from 'react';
import { formatCurrency } from '@/lib/formatting';

export interface OrderItemDisplay {
  productName: string;
  quantity: number;
  size: string;
  sugarLevel: string;
  iceLevel: string;
  unitPrice: number;
  lineTotal: number;
}

interface OrderSummaryStatusProps {
  orderItems: OrderItemDisplay[];
  subtotal: number;
  total: number;
  driverNote?: string;
}

export function OrderSummaryStatus({ orderItems, subtotal, total, driverNote }: OrderSummaryStatusProps) {
  return (
    <div className="w-full py-8 px-4 md:px-8 bg-white border-t border-amber-100">
      <div className="max-w-3xl mx-auto">
        {/* Section Title */}
        <h2 className="text-xl md:text-2xl font-serif font-bold text-amber-950 mb-6">Order Summary</h2>

        {/* Items List */}
        <div className="space-y-4 mb-6">
          {orderItems.map((item, index) => (
            <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-200">
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.productName}</p>
                <div className="text-xs md:text-sm text-gray-600 mt-1 space-y-0.5">
                  <p>
                    <span className="font-medium">Size:</span> {item.size}
                  </p>
                  <p>
                    <span className="font-medium">Sugar:</span> {item.sugarLevel}
                  </p>
                  <p>
                    <span className="font-medium">Ice:</span> {item.iceLevel}
                  </p>
                  <p>
                    <span className="font-medium">Qty:</span> {item.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-gray-600">{formatCurrency(item.unitPrice)}</p>
                <p className="font-semibold text-amber-900">{formatCurrency(item.lineTotal)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Driver Note Section */}
        {driverNote && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
              Special Instructions for Driver
            </p>
            <p className="text-sm md:text-base text-amber-900 break-words">{driverNote}</p>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="border-t-2 border-amber-300 pt-4 space-y-2">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-base md:text-lg font-bold text-amber-950">
            <span>Total:</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-4 pt-2 border-t border-gray-200">
            <span>Payment Method:</span>
            <span className="font-medium">Cash on Delivery (COD)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
