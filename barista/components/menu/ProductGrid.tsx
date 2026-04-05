'use client';

import { useEffect, useRef, useState } from 'react';
import { Product } from '@/lib/api';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
}

const PRODUCTS_PER_PAGE = 12;

export default function ProductGrid({ products, onProductSelect }: ProductGridProps) {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initialize with first page of products
  useEffect(() => {
    setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
    setCurrentPage(1);
  }, [products]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedProducts.length < products.length &&
          displayedProducts.length > 0
        ) {
          // Load next page
          const nextPage = currentPage + 1;
          const nextProducts = products.slice(0, nextPage * PRODUCTS_PER_PAGE);
          setDisplayedProducts(nextProducts);
          setCurrentPage(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [displayedProducts, products, currentPage]);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-5xl mb-4">☕</div>
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No Items Available</h3>
        <p className="text-[#8E8680] text-center">This category doesn't have any items yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddClick={onProductSelect}
          />
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {displayedProducts.length < products.length && (
        <>
          <div ref={observerTarget} className="h-4 flex justify-center py-4">
            <div className="text-[#8E8680] text-sm">Loading more...</div>
          </div>
        </>
      )}

      {/* End of products indicator */}
      {displayedProducts.length >= products.length && products.length > 0 && (
        <div className="text-center py-6 text-[#8E8680] text-sm">
          All {products.length} products loaded
        </div>
      )}
    </div>
  );
}
