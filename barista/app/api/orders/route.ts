import { NextResponse, NextRequest } from 'next/server';
import crypto from 'crypto';
import { getOrders, addOrder } from '@/lib/order-storage';

export async function POST(request: NextRequest) {
  try {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    const body = await request.json();

    // Validate required fields
    const { items, customerName, phoneNumber, deliveryAddress, driverNote, paymentMethod, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (!customerName || !customerName.trim()) {
      return NextResponse.json({ error: 'Customer name is required' }, { status: 400 });
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    if (!deliveryAddress || !deliveryAddress.trim()) {
      return NextResponse.json({ error: 'Delivery address is required' }, { status: 400 });
    }

    if (!paymentMethod || paymentMethod !== 'COD') {
      return NextResponse.json({ error: 'COD payment method required' }, { status: 400 });
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create order object
    const order = {
      id: orderId,
      items,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      deliveryAddress: deliveryAddress.trim(),
      driverNote: driverNote?.trim() || '',
      paymentMethod: 'COD',
      subtotal: items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0),
      total: total || items.reduce((sum: number, item: any) => sum + (item.subtotal || 0), 0),
      status: 'Received',
      createdAt: new Date().toISOString(),
      statusUpdatedAt: new Date().toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60000).toISOString(), // 30 min from now
    };

    // Store order using shared storage
    addOrder(orderId, order);

    // Return success response
    return NextResponse.json(
      {
        id: orderId,
        status: order.status,
        message: `Order confirmed! Your order ID is ${orderId}`,
        estimatedDelivery: order.estimatedDeliveryTime,
      },
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (err: any) {
    console.error('Order submission error:', err);

    return NextResponse.json(
      { error: err.message || 'Failed to process order' },
      { status: 500 }
    );
  }
}
