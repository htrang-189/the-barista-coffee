'use client';

import Image from 'next/image';
import { Product } from '@/lib/api';
import { formatCurrency } from '@/lib/formatting';
import { getProductImageUrl } from '@/lib/product-images';
import { Button } from '@/components/common';

interface ProductCardProps {
  product: Product;
  onAddClick: (product: Product) => void;
}

export default function ProductCard({ product, onAddClick }: ProductCardProps) {
  const isOutOfStock = !product.isAvailable;
  // Get unique image URL for this product
  const imageUrl = product.imageUrl || getProductImageUrl(product.id);

  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-[#F2EFE9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
          priority={false}
        />

        {/* Sold Out Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="bg-[#DC2626] text-white px-3 py-1 rounded-lg font-semibold text-sm">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-[#1A1A1A] line-clamp-1 mb-1">{product.name}</h3>
        <p className="text-sm text-[#8E8680] line-clamp-1 mb-3">{product.description}</p>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#8B6F47]">{formatCurrency(product.price)}</span>
          <Button
            variant={isOutOfStock ? 'ghost' : 'secondary'}
            size="sm"
            onClick={() => onAddClick(product)}
            disabled={isOutOfStock}
            aria-label={`Add ${product.name} to order`}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
}
