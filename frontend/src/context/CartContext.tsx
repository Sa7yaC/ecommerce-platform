import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem } from '../types/order';
import type { Product } from '../types/product';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => { success: boolean; message?: string };
  removeFromCart: (productId: number, size?: string) => void;
  updateQuantity: (productId: number, quantity: number, size?: string) => { success: boolean; message?: string };
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const getAvailableStock = (product: Product, size?: string): number => {
    if (size && product.sizes && product.sizes.length > 0) {
      const matched = product.sizes.find((s) => s.size === size);
      return matched ? matched.stock : 0;
    }
    return product.stock;
  };

  const addToCart = (
    product: Product,
    quantity: number = 1,
    size?: string
  ): { success: boolean; message?: string } => {
    // If product is inactive, block immediately
    if (product.is_active === false) {
      return {
        success: false,
        message: `"${product.name}" is currently inactive and cannot be added to your cart.`,
      };
    }

    // If product has sizes and no size selected
    if (product.sizes && product.sizes.length > 0 && !size) {
      return { success: false, message: 'Please select a size before adding to cart.' };
    }

    const availableStock = getAvailableStock(product, size);
    if (availableStock <= 0) {
      return {
        success: false,
        message: size
          ? `Size "${size}" is currently out of stock.`
          : 'This item is currently out of stock.',
      };
    }

    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id && (item.size || undefined) === (size || undefined)
    );

    if (existingIndex > -1) {
      const existing = items[existingIndex];
      const newQty = existing.quantity + quantity;
      if (newQty > availableStock) {
        return {
          success: false,
          message: `Cannot add more. Only ${availableStock} units available ${size ? `in size ${size}` : 'in stock'}.`,
        };
      }
      const updated = [...items];
      updated[existingIndex] = { ...existing, quantity: newQty };
      setItems(updated);
    } else {
      if (quantity > availableStock) {
        return {
          success: false,
          message: `Cannot add ${quantity} units. Only ${availableStock} available ${size ? `in size ${size}` : ''}.`,
        };
      }
      setItems([...items, { product, quantity, size }]);
    }

    return { success: true };
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    size?: string
  ): { success: boolean; message?: string } => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return { success: true };
    }

    const item = items.find(
      (i) => i.product.id === productId && (i.size || undefined) === (size || undefined)
    );

    if (item && item.product.is_active === false) {
      return {
        success: false,
        message: `"${item.product.name}" is currently inactive. Please remove it from your cart.`,
      };
    }
    if (!item) return { success: false, message: 'Item not found in cart.' };

    const availableStock = getAvailableStock(item.product, size);
    if (quantity > availableStock) {
      return {
        success: false,
        message: `Only ${availableStock} units available in stock.`,
      };
    }

    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && (i.size || undefined) === (size || undefined)
          ? { ...i, quantity }
          : i
      )
    );
    return { success: true };
  };

  const removeFromCart = (productId: number, size?: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.product.id === productId && (i.size || undefined) === (size || undefined))
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
