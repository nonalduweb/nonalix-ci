'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { Product, CartItem, CartState } from '@/types/product';
import { fbTrack } from '@/lib/fbpixel';

// Actions
type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

// Helpers
function calculateTotals(items: CartItem[]): { totalItems: number; totalAmount: number } {
  return {
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  };
}

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  let newItems: CartItem[];

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity: 1 }];
      }
      return { ...calculateTotals(newItems), items: newItems };
    }

    case 'REMOVE_ITEM':
      newItems = state.items.filter((item) => item.product.id !== action.productId);
      return { ...calculateTotals(newItems), items: newItems };

    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        newItems = state.items.filter((item) => item.product.id !== action.productId);
      } else {
        newItems = state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: action.quantity }
            : item
        );
      }
      return { ...calculateTotals(newItems), items: newItems };

    case 'CLEAR_CART':
      return { items: [], totalItems: 0, totalAmount: 0 };

    case 'LOAD_CART':
      return { ...calculateTotals(action.items), items: action.items };

    default:
      return state;
  }
}

// Context
interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'nonalix_cart';

// Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: CartItem[] = JSON.parse(stored);
        dispatch({ type: 'LOAD_CART', items });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore storage errors
    }
  }, [state.items]);

  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', product });
    fbTrack('AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'XOF',
    });
  };
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQuantity = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
