'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/api';
import { useCartStore } from '@/store';
import { useMenu } from '@/hooks/useMenu';
import { generateHash } from '@/lib/utils/hash';
import {
  Sidebar,
  ProductGrid,
  CustomizationModal,
  StickyOrderBar,
  OrderSummaryModal,
} from '@/components/menu';

const HARD_LIMIT = 30;

export default function MenuPage() {
  const { categories, products, loading, error, isOffline } = useMenu();
  const cartState = useCartStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [showOrderSummaryModal, setShowOrderSummaryModal] = useState(false);
  const [warning, setWarning] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [hardLimitError, setHardLimitError] = useState(false);

  // Set first category as default
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

  // Filter products by selected category
  const filteredProducts = selectedCategoryId
    ? products.filter((p) => p.categoryId === selectedCategoryId)
    : [];

  const handleProductSelect = (product: Product) => {
    // Check hard limit
    if (cartState.itemCount >= HARD_LIMIT) {
      setHardLimitError(true);
      setTimeout(() => setHardLimitError(false), 3000);
      return;
    }
    
    setSelectedProduct(product);
    setShowCustomizationModal(true);
  };

  const handleAddToOrder = (customization: {
    product: Product;
    size: 'S' | 'M' | 'L';
    sugarLevel: string;
    iceLevel: string;
    quantity: number;
  }) => {
    // Check if adding this quantity would exceed limit
    if (cartState.itemCount + customization.quantity > HARD_LIMIT) {
      setHardLimitError(true);
      setTimeout(() => setHardLimitError(false), 3000);
      return;
    }

    // Generate unique ID based on product and customization
    const customizationHash = generateHash(
      customization.size + customization.sugarLevel + customization.iceLevel
    );
    const itemId = `${customization.product.id}-${customizationHash}`;

    cartState.addItem({
      id: itemId,
      productId: customization.product.id,
      productName: customization.product.name,
      quantity: customization.quantity,
      price: customization.product.price,
      size: customization.size,
      sugarLevel: customization.sugarLevel,
      iceLevel: customization.iceLevel,
      subtotal: customization.product.price * customization.quantity,
    });

    setShowCustomizationModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={selectedCategoryId}
        onCategorySelect={setSelectedCategoryId}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center text-sm text-yellow-800">
            📡 Using cached menu (You're offline)
          </div>
        )}

        {/* Hard Limit Error */}
        {hardLimitError && (
          <div className="bg-[#FEE2E2] border-b border-[#DC2626] px-4 py-2 text-center text-sm text-[#DC2626]">
            ❌ Maximum 30 items per order reached. Please checkout or remove items to add more.
          </div>
        )}

        {/* Soft Limit Warning */}
        {warning.show && (
          <div className="bg-orange-100 border-b border-orange-300 px-4 py-2 flex items-center justify-between text-sm text-orange-800">
            <span>⚠️ {warning.message}</span>
            <button
              onClick={() => setWarning({ show: false, message: '' })}
              className="font-bold hover:text-orange-900"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-[#DC2626] font-semibold mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#8B6F47] text-white rounded-lg hover:bg-[#7b6242]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !isOffline && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="animate-spin text-4xl mb-4">☕</div>
            <p className="text-[#8E8680]">Loading menu...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <ProductGrid products={filteredProducts} onProductSelect={handleProductSelect} />
        )}

        {/* Padding for Sticky Bar */}
        {cartState.itemCount > 0 && <div className="h-32 md:h-24" />}
      </main>

      {/* Modals */}
      <CustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        product={selectedProduct}
        onAddToOrder={handleAddToOrder}
      />

      <OrderSummaryModal
        isOpen={showOrderSummaryModal}
        onClose={() => setShowOrderSummaryModal(false)}
        onCheckout={() => {
          // Navigate to checkout page
          window.location.href = '/checkout';
        }}
      />

      {/* Sticky Order Bar */}
      <StickyOrderBar 
        cartState={cartState} 
        onViewOrder={() => setShowOrderSummaryModal(true)}
        onWarning={(isWarning, message) => {
          if (isWarning) {
            setWarning({ show: true, message: `You have ${cartState.itemCount} items in your order` });
          } else {
            setWarning({ show: false, message: '' });
          }
        }}
      />
    </div>
  );
}
