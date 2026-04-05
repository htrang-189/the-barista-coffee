import { NextResponse, NextRequest } from 'next/server';
import { getOrder } from '@/lib/order-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    // Get order from shared storage
    const order = getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Format the response with proper item structure
    const formattedResponse = {
      id: order.id,
      items: order.items.map((item: any) => ({
        productName: item.productName || item.name,
        quantity: item.quantity,
        size: item.size || 'M',
        sugarLevel: item.sugarLevel || '100%',
        iceLevel: item.iceLevel || 'Regular',
        unitPrice: item.price || 0,
        lineTotal: item.subtotal || (item.price * item.quantity),
      })),
      subtotal: order.subtotal || order.items.reduce((sum: number, item: any) => sum + (item.subtotal || item.price * item.quantity), 0),
      total: order.total,
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
      deliveryAddress: order.deliveryAddress,
      driverNote: order.driverNote || '',
      status: order.status,
      createdAt: order.createdAt,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
    };

    return NextResponse.json(formattedResponse, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: any) {
    console.error('Error retrieving order:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}
