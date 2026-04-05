'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState, CartItem } from './cartTypes';

const CART_STORAGE_KEY = 'BARISTA_CART';
const CART_EXPIRY_DAYS = 7;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      driverNote: '',
      totalPrice: 0,
      itemCount: 0,
      createdAt: Date.now(),

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          let newItems: CartItem[];
          if (existing) {
            // Update quantity if item with same customization exists
            newItems = state.items.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    quantity: i.quantity + item.quantity,
                    subtotal: (i.quantity + item.quantity) * i.price,
                  }
                : i
            );
          } else {
            // Add new item
            newItems = [...state.items, item];
          }

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId);
          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            // Remove item if quantity becomes 0
            const newItems = state.items.filter((i) => i.id !== itemId);
            return {
              items: newItems,
              totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
              itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
            };
          }

          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity, subtotal: quantity * i.price } : i
          );

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      updateItem: (itemId, updates) => {
        set((state) => {
          const newItems = state.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i));

          return {
            items: newItems,
            totalPrice: newItems.reduce((sum, i) => sum + i.subtotal, 0),
            itemCount: newItems.reduce((sum, i) => sum + i.quantity, 0),
          };
        });
      },

      setDriverNote: (note) => {
        set({ driverNote: note.slice(0, 500) }); // Max 500 chars
      },

      clearCart: () => {
        set({
          items: [],
          driverNote: '',
          totalPrice: 0,
          itemCount: 0,
          createdAt: Date.now(),
        });
      },

      getTotalPrice: () => get().totalPrice,
      getItemCount: () => get().itemCount,
      getSubtotal: () => get().totalPrice,
    }),
    {
      name: CART_STORAGE_KEY,
      version: 1,
      // Custom migration to handle expiry
      migrate: (persistedState: any, version) => {
        const now = Date.now();
        const daysSinceCreation =
          (now - (persistedState as any)?.createdAt || 0) / (1000 * 60 * 60 * 24);

        // Clear cart if >7 days old
        if (daysSinceCreation > CART_EXPIRY_DAYS) {
          return {
            items: [],
            driverNote: '',
            totalPrice: 0,
            itemCount: 0,
            createdAt: Date.now(),
          };
        }

        return persistedState;
      },
    }
  )
);
