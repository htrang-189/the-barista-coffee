'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProgressBar, ThankYouSection, OrderSummaryStatus, CallShopButton, OrderStatusType } from '@/components/order-status';
import { useCartStore } from '@/store/cartStore';
import { apiClient } from '@/lib/api';

interface OrderData {
  id: string;
  items: Array<{
    productName: string;
    quantity: number;
    size: string;
    sugarLevel: string;
    iceLevel: string;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  total: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  driverNote?: string;
  status: OrderStatusType;
  createdAt: string;
  estimatedDeliveryTime?: string;
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const { clearCart } = useCartStore();

  // Fetch order data
  const fetchOrder = async () => {
    if (!orderId) return;
    
    try {
      const response = await apiClient.get(`/api/orders/${orderId}`);
      setOrder(response.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err: any) {
      setError(err.response?.status === 404 ? 'Order not found' : 'Failed to fetch order');
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Polling setup (5-10 seconds)
  useEffect(() => {
    if (!order || order.status === 'Completed' || !isOnline) return;

    const interval = setInterval(() => {
      fetchOrder();
    }, 7000); // 7 seconds between polls

    return () => clearInterval(interval);
  }, [order, isOnline, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-700 rounded-full" />
          </div>
          <p className="text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-amber-950 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not find your order.'}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg transition-colors"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 text-center">
          <p className="text-sm text-yellow-800">
            📵 <span className="font-semibold">You're offline</span> - Displaying last known order status
          </p>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-amber-100 py-4 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-amber-950">
            Order Status
          </h1>
          <p className="text-sm text-gray-600 mt-2">Order #{order.id}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-8">
        {/* Thank You Section - Positioned Prominently Above Progress Bar */}
        <ThankYouSection orderNumber={order.id} />

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto">
          <ProgressBar currentStatus={order.status} createdAt={order.createdAt} estimatedDeliveryTime={order.estimatedDeliveryTime} />
        </div>

        {/* Order Summary */}
        <OrderSummaryStatus
          orderItems={order.items}
          subtotal={order.subtotal}
          total={order.total}
          driverNote={order.driverNote}
        />

        {/* Last Updated & Manual Refresh */}
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs md:text-sm text-gray-500">
              {lastUpdated
                ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
                : 'Fetching order details...'}
            </p>
            <button
              onClick={fetchOrder}
              className="px-4 py-2 text-sm text-amber-700 hover:text-amber-900 font-medium border border-amber-300 hover:border-amber-400 rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Call Shop & Actions */}
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-4">
          <CallShopButton phoneNumber="+84239100000" label="Call Shop for Support" />
          
          {order.status === 'Completed' && (
            <a
              href="/menu"
              className="w-full px-6 py-3 md:py-4 bg-gradient-to-r from-amber-100 to-amber-50 hover:from-amber-200 hover:to-amber-100 text-amber-900 font-semibold rounded-lg transition-colors border border-amber-300 text-center"
            >
              Order Again
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
