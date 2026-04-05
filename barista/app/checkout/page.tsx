'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store';
import { apiClient } from '@/lib/api/client';
import { CheckoutForm, OrderSummaryDisplay } from '@/components/checkout';
import { Button } from '@/components/common';
import { type CheckoutFormData } from '@/lib/checkout-validation';

export default function CheckoutPage() {
  const router = useRouter();
  const cartState = useCartStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ orderId: string; total: number } | null>(null);
  const [initialFormData, setInitialFormData] = useState<Partial<CheckoutFormData> | undefined>();
  const [submissionTimeout, setSubmissionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load cached checkout data on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem('BARISTA_CHECKOUT_DATA');
      if (cached) {
        const data = JSON.parse(cached);
        // Check if data hasn't expired (90 days)
        const expiryDate = new Date(data.expiryDate);
        if (expiryDate > new Date()) {
          setInitialFormData({
            name: data.name || '',
            phone: data.phone || '',
            address: data.address || '',
            driverNote: '',
          });
        } else {
          // Clear expired data
          localStorage.removeItem('BARISTA_CHECKOUT_DATA');
        }
      }
    } catch (err) {
      console.warn('Failed to load cached checkout data:', err);
    }
  }, []);

  const handleFormSubmit = async (formData: CheckoutFormData, formattedPhone: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setElapsedTime(0);

    // Track submission time for timeout messaging
    let timeoutTimer: NodeJS.Timeout | undefined;
    let timeTracker: NodeJS.Timeout | undefined;

    try {
      // Set up timers
      timeTracker = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      const timeoutPromise = new Promise((_, reject) => {
        timeoutTimer = setTimeout(() => {
          reject(new Error('Request timeout: Submission took longer than 30 seconds'));
        }, 30000);
      });

      // Prepare order data
      const orderData = {
        items: cartState.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          sugarLevel: item.sugarLevel,
          iceLevel: item.iceLevel,
          subtotal: item.subtotal,
        })),
        subtotal: cartState.totalPrice,
        total: cartState.totalPrice,
        customerName: formData.name,
        phoneNumber: formattedPhone,
        deliveryAddress: formData.address,
        driverNote: formData.driverNote,
        paymentMethod: 'COD' as const,
      };

      // Submit order
      const submitPromise = apiClient.post('/api/orders', orderData);
      const response = await Promise.race([submitPromise, timeoutPromise]);

      if (timeTracker) clearInterval(timeTracker);
      if (timeoutTimer) clearTimeout(timeoutTimer);

      // Handle success
      if (response && typeof response === 'object' && 'id' in response) {
        setSuccessData({
          orderId: (response as any).id,
          total: cartState.totalPrice,
        });
        setShowSuccess(true);

        // Clear cart
        cartState.clearCart();

        // Redirect after 2 seconds or on user action
        const redirectTimer = setTimeout(() => {
          router.push(`/order-status/${(response as any).id}`);
        }, 2000);

        setSubmissionTimeout(redirectTimer);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      if (timeTracker) clearInterval(timeTracker);
      if (timeoutTimer) clearTimeout(timeoutTimer);

      const errorMessage =
        err?.message === 'Request timeout: Submission took longer than 30 seconds'
          ? `Taking longer than expected (${elapsedTime}s). Please wait or try again.`
          : err?.message || 'Order submission failed. Please try again.';

      setSubmitError(errorMessage);

      // Re-enable form for retry
      setIsSubmitting(false);
    } finally {
      // Cleanup
      if (submissionTimeout) {
        clearTimeout(submissionTimeout);
      }
    }
  };

  const handleRetry = () => {
    setSubmitError(null);
    setIsSubmitting(false);
  };

  const handleEditOrder = () => {
    router.back();
  };

  const handleContinueShopping = () => {
    router.push('/menu');
  };

  const handleViewOrderStatus = () => {
    if (successData) {
      router.push(`/order-status/${successData.orderId}`);
    }
  };

  // Show success screen
  if (showSuccess && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F7F4] to-[#EFE9DC] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Order Confirmed!</h1>
          <p className="text-[#8E8680] mb-4">
            Order ID: <span className="font-mono font-semibold text-[#1A1A1A]">{successData.orderId}</span>
          </p>
          <p className="text-3xl font-bold text-[#8B6F47] mb-6">
            Total: {cartState.totalPrice || successData.total} đ
          </p>
          <p className="text-[#8E8680] text-sm mb-6">
            You will be redirected to order status page in a moment...
          </p>
          <Button
            variant="primary"
            className="w-full"
            onClick={handleViewOrderStatus}
          >
            View Order Status
          </Button>
        </div>
      </div>
    );
  }

  // Show error state
  if (submitError && isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F9F7F4] to-[#EFE9DC] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-[#DC2626] mb-4">Submission in Progress</h1>
          <p className="text-[#8E8680] mb-6">{submitError}</p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleContinueShopping}
            >
              Go Back
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F4] to-[#EFE9DC] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="text-[#8B6F47] hover:text-[#654321] font-medium mb-6 flex items-center gap-2"
        >
          ← Back to Menu
        </button>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-8">Checkout</h1>

        {/* Error Message */}
        {submitError && !isSubmitting && (
          <div className="bg-[#FEE2E2] border-2 border-[#DC2626] rounded-lg p-4 mb-6">
            <p className="text-[#DC2626] font-semibold mb-3">{submitError}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRetry}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Order Summary (1 col on desktop, full width on mobile) */}
          <div className="md:col-span-1">
            <OrderSummaryDisplay
              cartState={cartState}
              onEdit={handleEditOrder}
              onContinueShopping={handleContinueShopping}
            />
          </div>

          {/* Right: Checkout Form (2 cols on desktop, full width on mobile) */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Delivery Details</h2>
              <CheckoutForm
                onSubmit={handleFormSubmit}
                isLoading={isSubmitting}
                initialData={initialFormData}
              />
            </div>
          </div>
        </div>

        {/* Mobile: Stack vertically */}
        <style jsx>{`
          @media (max-width: 768px) {
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
