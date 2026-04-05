// Shared order storage for API endpoints
const orders: Map<string, any> = new Map();

// Initialize sample orders
function initializeSampleOrders() {
  if (!orders.has('ORD-SAMPLE-001')) {
    const sampleOrder = {
      id: 'ORD-SAMPLE-001',
      items: [
        {
          productName: 'Espresso',
          quantity: 1,
          size: 'M',
          sugarLevel: '50%',
          iceLevel: 'Regular',
          price: 50000,
          subtotal: 50000,
        },
        {
          productName: 'Cappuccino',
          quantity: 1,
          size: 'L',
          sugarLevel: '75%',
          iceLevel: 'Extra',
          price: 65000,
          subtotal: 65000,
        },
      ],
      subtotal: 115000,
      total: 115000,
      customerName: 'John Doe',
      phoneNumber: '0912345678',
      deliveryAddress: '123 Main Street, District 1, HCMC',
      driverNote: 'Leave at reception 🏢',
      paymentMethod: 'COD',
      status: 'Preparing' as const,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      statusUpdatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
      estimatedDeliveryTime: new Date(Date.now() + 15 * 60000).toISOString(),
    };
    
    orders.set(sampleOrder.id, sampleOrder);
    console.log('[Order Storage] Sample order initialized: ORD-SAMPLE-001');
  }
}

// Initialize on module load
initializeSampleOrders();

export function getOrders() {
  initializeSampleOrders(); // Ensure sample order exists
  return orders;
}

export function addOrder(orderId: string, orderData: any) {
  orders.set(orderId, orderData);
  console.log(`[Order Storage] Order stored: ${orderId}`);
}

export function getOrder(orderId: string) {
  initializeSampleOrders(); // Ensure sample order exists
  const order = orders.get(orderId);
  console.log(`[Order Storage] Looking for order: ${orderId}, Found: ${!!order}`);
  return order;
}
