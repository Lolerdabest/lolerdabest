'use client';

import type { CartItem, Item, Enchantment } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item, enchantments: Enchantment[], quantity: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Item, selectedEnchantments: Enchantment[], quantity: number) => {
    // Since enchantments are not selectable, the cartId can be simplified.
    const cartId = `${item.id}-${item.name}`;

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex((cartItem) => cartItem.cartId === cartId);

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
        return newCart;
      } else {
        const newItem: CartItem = {
          ...item,
          cartId,
          quantity,
          selectedEnchantments,
        };
        return [...prevCart, newItem];
      }
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
       return total + item.price * item.quantity;
    }, 0);
  }, [cart]);
  
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
