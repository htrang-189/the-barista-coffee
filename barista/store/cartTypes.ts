export interface CartItem {
  id: string; // Unique ID: productId + customization hash
  productId: string;
  productName: string;
  quantity: number;
  price: number; // Unit price (VND)
  size: 'S' | 'M' | 'L';
  sugarLevel: string; // "No", "25%", "50%", "75%", "100%"
  iceLevel: string; // "No", "Light", "Regular", "Extra"
  subtotal: number; // price * quantity
}

export interface CartState {
  items: CartItem[];
  driverNote: string; // Delivery instructions (max 500 chars)
  totalPrice: number;
  itemCount: number;
  createdAt: number; // Timestamp

  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  setDriverNote: (note: string) => void;
  clearCart: () => void;

  // Getters
  getTotalPrice: () => number;
  getItemCount: () => number;
  getSubtotal: () => number;
}
