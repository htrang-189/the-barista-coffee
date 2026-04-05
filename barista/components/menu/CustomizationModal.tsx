'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/api';
import { formatCurrency } from '@/lib/formatting';
import { Modal, Button } from '@/components/common';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToOrder: (customization: {
    product: Product;
    size: 'S' | 'M' | 'L';
    sugarLevel: string;
    iceLevel: string;
    quantity: number;
  }) => void;
}

const SIZES = ['S', 'M', 'L'] as const;
const SUGAR_LEVELS = ['No Sugar', '25%', '50%', '75%', '100%'];
const ICE_LEVELS = ['No Ice', 'Light', 'Regular', 'Extra'];

export default function CustomizationModal({
  isOpen,
  onClose,
  product,
  onAddToOrder,
}: CustomizationModalProps) {
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L'>('M');
  const [selectedSugar, setSelectedSugar] = useState('50%');
  const [selectedIce, setSelectedIce] = useState('Regular');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToOrder = () => {
    onAddToOrder({
      product,
      size: selectedSize,
      sugarLevel: selectedSugar,
      iceLevel: selectedIce,
      quantity,
    });

    // Reset form
    setSelectedSize('M');
    setSelectedSugar('50%');
    setSelectedIce('Regular');
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    // Reset form without saving
    setSelectedSize('M');
    setSelectedSugar('50%');
    setSelectedIce('Regular');
    setQuantity(1);
    onClose();
  };

  const subtotal = product.price * quantity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={product.name}
    >
      <div className="space-y-6">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-[#F2EFE9] rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#D4A574] to-[#8B6F47]">
              <svg
                className="w-1/3 h-1/3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v2h1c.6 0 1 .4 1 1v7c0 1.1-.9 2-2 2h-1v2c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-2H2c-1.1 0-2-.9-2-2V8c0-.6.4-1 1-1h1V5zm2 2v8h12V7H5zm-2 9c0 .6.4 1 1 1h2v2h12v-2h2c.6 0 1-.4 1-1v-2H3v2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Size
          </label>
          <div className="flex gap-3">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`flex-1 py-2 px-3 rounded-md font-medium transition-all min-h-[44px] ${
                  selectedSize === size
                    ? 'bg-[#8B6F47] text-white'
                    : 'bg-[#F2EFE9] text-[#1A1A1A] hover:bg-[#E8E3D9]'
                }`}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Sugar Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Sugar Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUGAR_LEVELS.map((sugar) => (
              <button
                key={sugar}
                onClick={() => setSelectedSugar(sugar)}
                className={`py-2 px-3 rounded-md font-medium transition-all min-h-[44px] text-sm ${
                  selectedSugar === sugar
                    ? 'bg-[#8B6F47] text-white'
                    : 'bg-[#F2EFE9] text-[#1A1A1A] hover:bg-[#E8E3D9]'
                }`}
                aria-pressed={selectedSugar === sugar}
              >
                {sugar}
              </button>
            ))}
          </div>
        </div>

        {/* Ice Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Ice Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ICE_LEVELS.map((ice) => (
              <button
                key={ice}
                onClick={() => setSelectedIce(ice)}
                className={`py-2 px-3 rounded-md font-medium transition-all min-h-[44px] text-sm ${
                  selectedIce === ice
                    ? 'bg-[#8B6F47] text-white'
                    : 'bg-[#F2EFE9] text-[#1A1A1A] hover:bg-[#E8E3D9]'
                }`}
                aria-pressed={selectedIce === ice}
              >
                {ice}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Adjuster */}
        <div>
          <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
            Quantity
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 rounded-md bg-[#F2EFE9] hover:bg-[#E8E3D9] transition-colors flex items-center justify-center font-bold text-lg"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <div className="flex-1 text-center font-bold text-lg">{quantity}</div>
            <button
              onClick={() => setQuantity(Math.min(99, quantity + 1))}
              className="w-12 h-12 rounded-md bg-[#F2EFE9] hover:bg-[#E8E3D9] transition-colors flex items-center justify-center font-bold text-lg"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#F2EFE9] rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#8E8680]">
              {selectedSize} | {selectedSugar} Sugar | {selectedIce} Ice
            </span>
            <span className="font-semibold text-[#1A1A1A]">x{quantity}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#8E8680]">Subtotal:</span>
            <span className="text-2xl font-bold text-[#8B6F47]">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddToOrder}
            className="flex-1"
          >
            Add to Order
          </Button>
        </div>
      </div>
    </Modal>
  );
}
