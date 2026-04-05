'use client';

import React from 'react';

export type OrderStatusType = 'Received' | 'Preparing' | 'OutForDelivery' | 'Completed';

interface Stage {
  key: OrderStatusType;
  label: string;
  estimatedTime: string;
}

const STAGES: Record<OrderStatusType, Stage> = {
  Received: { key: 'Received', label: 'Received', estimatedTime: 'Order confirmed' },
  Preparing: { key: 'Preparing', label: 'Preparing', estimatedTime: 'Usually 15-20 min' },
  OutForDelivery: { key: 'OutForDelivery', label: 'Out for Delivery', estimatedTime: '5-10 min away' },
  Completed: { key: 'Completed', label: 'Completed', estimatedTime: 'Delivered' },
};

const STAGE_ORDER: OrderStatusType[] = ['Received', 'Preparing', 'OutForDelivery', 'Completed'];

interface ProgressBarProps {
  currentStatus: OrderStatusType;
  createdAt?: string;
  estimatedDeliveryTime?: string;
}

export function ProgressBar({ currentStatus, createdAt, estimatedDeliveryTime }: ProgressBarProps) {
  const currentIndex = STAGE_ORDER.indexOf(currentStatus);

  return (
    <div className="w-full py-8 px-4 md:px-8">
      {/* Progress Line Container */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        {STAGE_ORDER.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const stageInfo = STAGES[stage];

          return (
            <div key={stage} className="flex flex-col items-center flex-1">
              {/* Connector Line */}
              {index < STAGE_ORDER.length - 1 && (
                <div
                  className={`absolute top-8 left-[${50 + (index * 100) / (STAGE_ORDER.length - 1)}%] w-[calc(100%/${STAGE_ORDER.length - 1} - 2rem)] h-1 transform -translate-y-1/2 ${
                    isCompleted || isActive
                      ? 'bg-amber-700'
                      : 'bg-gray-300'
                  }`}
                />
              )}

              {/* Stage Circle */}
              <div
                className={`relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-sm md:text-base font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-amber-700 text-white'
                    : isActive
                    ? 'bg-amber-600 text-white ring-4 ring-amber-200 animate-pulse'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Stage Label & Time */}
              <div className="mt-3 md:mt-4 text-center">
                <p className={`text-xs md:text-sm font-semibold ${isActive ? 'text-amber-800' : 'text-gray-600'}`}>
                  {stageInfo.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stageInfo.estimatedTime}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Message */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm md:text-base text-gray-700">
          {currentStatus === 'Completed'
            ? '✅ Your order has been delivered! Thank you for your order.'
            : `📍 Your order is ${STAGES[currentStatus].label.toLowerCase()}.`}
        </p>
      </div>
    </div>
  );
}
