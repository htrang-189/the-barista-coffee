'use client';

import { CartItem, CartState } from '@/store/cartTypes';
import { Modal, Button } from '@/components/common';
import { formatCurrency } from '@/lib/formatting';
import { useCartStore } from '@/store';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function OrderSummaryModal({
  isOpen,
  onClose,
  onCheckout,
}: OrderSummaryModalProps) {
  const cartState = useCartStore();

  const handleDecreaseQuantity = (itemId: string, currentQty: number) => {
    if (currentQty > 1) {
      cartState.updateQuantity(itemId, currentQty - 1);
    }
  };

  const handleIncreaseQuantity = (itemId: string, currentQty: number) => {
    if (currentQty < 30) {
      cartState.updateQuantity(itemId, currentQty + 1);
    }
  };

  const handleRemove = (itemId: string) => {
    cartState.removeItem(itemId);
  };

  const isEmpty = cartState.itemCount === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Order">
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-5xl mb-4">☕</div>
            <p className="text-[#1A1A1A] font-semibold mb-4">Your cart is empty</p>
            <Button variant="secondary" onClick={onClose}>
              Go to Menu
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-3">
              {cartState.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#F2EFE9] rounded-lg p-3 space-y-2"
                >
                  {/* Item Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#1A1A1A]">{item.productName}</h4>
                      <p className="text-xs text-[#8E8680]">
                        {item.size} | {item.sugarLevel} Sugar | {item.iceLevel} Ice
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-[#DC2626] hover:text-[#991B1B] font-semibold"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                        className="w-8 h-8 rounded bg-white hover:bg-[#E8E3D9] flex items-center justify-center text-sm font-bold"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center font-semibold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                        className="w-8 h-8 rounded bg-white hover:bg-[#E8E3D9] flex items-center justify-center text-sm font-bold"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-[#8B6F47]">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t-2 border-[#E8E3D9] pt-3 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-[#1A1A1A]">Total:</span>
                <span className="text-3xl font-bold text-[#8B6F47]">
                  {formatCurrency(cartState.totalPrice)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Continue Shopping
              </Button>
              <Button variant="primary" onClick={onCheckout} className="flex-1">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
