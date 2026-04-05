'use client';

import { CartState } from '@/store/cartTypes';
import { formatCurrency } from '@/lib/formatting';
import { Button } from '@/components/common';

interface OrderSummaryDisplayProps {
  cartState: CartState;
  onEdit: () => void;
  onContinueShopping: () => void;
}

export default function OrderSummaryDisplay({
  cartState,
  onEdit,
  onContinueShopping,
}: OrderSummaryDisplayProps) {
  const isEmpty = cartState.itemCount === 0;

  if (isEmpty) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">☕</div>
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your Cart is Empty</h2>
        <p className="text-[#8E8680] mb-6">
          Add some delicious coffee to your order before checking out.
        </p>
        <Button variant="secondary" onClick={onContinueShopping}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#E8E3D9]">
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Order Summary</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="text-sm"
        >
          Edit Order
        </Button>
      </div>

      {/* Order Items - Scrollable */}
      <div className={`space-y-3 mb-6 ${cartState.items.length >= 5 ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
        {cartState.items.map((item) => (
          <div key={item.id} className="bg-[#F9F7F4] rounded-lg p-4 border border-[#E8E3D9]">
            {/* Item Name & Customizations */}
            <div className="mb-2">
              <h3 className="font-semibold text-[#1A1A1A] text-lg">{item.productName}</h3>
              <p className="text-sm text-[#8E8680] mt-1">
                {item.size} | {item.sugarLevel} Sugar | {item.iceLevel} Ice
              </p>
            </div>

            {/* Quantity, Price, Total */}
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#E8E3D9]">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#8E8680]">Qty:</span>
                <span className="font-semibold text-[#1A1A1A]">×{item.quantity}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-[#8E8680]">{formatCurrency(item.price)}/item</p>
                  <p className="font-bold text-[#8B6F47] text-lg">{formatCurrency(item.subtotal)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Totals */}
      <div className="border-t-2 border-[#E8E3D9] pt-4 space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-[#8E8680]">Subtotal</span>
          <span className="font-semibold text-[#1A1A1A]">{formatCurrency(cartState.totalPrice)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#1A1A1A] font-semibold">Total</span>
          <span className="text-3xl font-bold text-[#8B6F47]">{formatCurrency(cartState.totalPrice)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 rounded-lg p-3 mt-4 border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>Payment Method:</strong> Cash on Delivery (COD) - Pay when your order arrives
        </p>
      </div>
    </div>
  );
}
