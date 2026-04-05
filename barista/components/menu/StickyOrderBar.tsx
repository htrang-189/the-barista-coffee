'use client';

import { useState, useEffect } from 'react';
import { CartState } from '@/store/cartTypes';
import { formatCurrency } from '@/lib/formatting';
import { Button } from '@/components/common';

interface StickyOrderBarProps {
  cartState: CartState;
  onViewOrder: () => void;
  onWarning?: (isWarning: boolean, message: string) => void;
}

const SOFT_LIMIT = 15;
const HARD_LIMIT = 30;

export default function StickyOrderBar({ cartState, onViewOrder, onWarning }: StickyOrderBarProps) {
  const [hasShownWarning, setHasShownWarning] = useState(false);

  useEffect(() => {
    // Show warning when reaching soft limit
    if (cartState.itemCount >= SOFT_LIMIT && cartState.itemCount < HARD_LIMIT && !hasShownWarning) {
      setHasShownWarning(true);
      onWarning?.(true, `You have ${cartState.itemCount} items in your order`);
    }
    
    // Clear warning when below soft limit
    if (cartState.itemCount < SOFT_LIMIT && hasShownWarning) {
      setHasShownWarning(false);
      onWarning?.(false, '');
    }
  }, [cartState.itemCount, hasShownWarning, onWarning]);

  if (cartState.itemCount === 0) {
    return null;
  }

  const isAtHardLimit = cartState.itemCount >= HARD_LIMIT;
  const isSoftWarning = cartState.itemCount >= SOFT_LIMIT && !isAtHardLimit;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40 ${
      isAtHardLimit ? 'border-[#DC2626] border-b-2' : 'border-[#E8E3D9]'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Order Info */}
        <div className="flex-1 min-w-0">
          <div className={`text-sm mb-1 ${isSoftWarning ? 'text-[#DC2626]' : 'text-[#8E8680]'}`}>
            Order Total {isSoftWarning && '⚠️'}
          </div>
          <div className="text-2xl font-bold text-[#8B6F47]">
            {formatCurrency(cartState.totalPrice)}
          </div>
          <div className={`text-xs ${isSoftWarning ? 'text-[#DC2626] font-semibold' : 'text-[#8E8680]'}`}>
            {cartState.itemCount} item{cartState.itemCount !== 1 ? 's' : ''}{isAtHardLimit && ' (Limit reached)'}
          </div>
        </div>

        {/* Right: View Order Button */}
        <Button
          variant="primary"
          onClick={onViewOrder}
          className="whitespace-nowrap min-h-[48px]"
          aria-label={`View order (${cartState.itemCount} items)`}
        >
          View Order
        </Button>
      </div>
    </div>
  );
}
