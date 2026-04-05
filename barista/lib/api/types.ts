export interface Category {
  id: string;
  name: string;
  displayOrder: number;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  description: string;
  isAvailable: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size: 'S' | 'M' | 'L';
  sugarLevel: string;
  iceLevel: string;
  subtotal: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  subtotal: number;
  total: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  driverNote: string;
  paymentMethod: 'COD';
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  driverNote: string;
  paymentMethod: 'COD';
  status: 'Received' | 'Preparing' | 'OutForDelivery' | 'Completed';
  createdAt: string;
  statusUpdatedAt: string;
  estimatedDeliveryTime: string;
  trackingUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  cacheControl?: string;
  eTag?: string;
}
