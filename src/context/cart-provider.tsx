'use client';

import type { CartItem, Item, Enchantment } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { formatEnchantment } from '@/lib/enchantment-utils';

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

const generateCartId = (item: Item, enchantments: Enchantment[]): string => {
  const sortedEnchantments = [...enchantments].sort((a, b) => a.name.localeCompare(b.name));
  const enchantmentString = sortedEnchantments.map(e => `${e.name}@${e.level}`).join(',');
  return `${item.id}-${enchantmentString}`;
};


export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = useCallback((item: Item, selectedEnchantments: Enchantment[], quantity: number) => {
    const cartId = generateCartId(item, selectedEnchantments);

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
  }, []);

  const removeFromCart = useCallback((cartId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartId === cartId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => {
       const itemTotalCost = item.price + item.selectedEnchantments.reduce((acc, ench) => acc + ench.cost, 0);
       return total + itemTotalCost * item.quantity;
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
