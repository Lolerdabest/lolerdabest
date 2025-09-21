'use client';

import type { CartItem, Item, Enchantment } from '@/lib/types';
import React, { createContext, useContext, useState, useMemo } from 'react';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Item, enchantments: Enchantment[]) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: Item, selectedEnchantments: Enchantment[]) => {
    setCart((prevCart) => {
      // Create a unique ID for the cart item based on the item and its enchantments
      const enchantmentString = selectedEnchantments.map(e => `${e.name}${e.level}`).sort().join('-');
      const cartId = `${item.id}-${enchantmentString}`;
      
      const existingItem = prevCart.find((cartItem) => cartItem.cartId === cartId);
      
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.cartId === cartId
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      
      const newItem: CartItem = { 
        ...item, 
        cartId, 
        quantity: 1, 
        selectedEnchantments 
      };
      return [...prevCart, newItem];
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
      const enchantmentCost = item.selectedEnchantments.reduce((cost, ench) => cost + 0.5 * ench.level, 0);
      return total + (item.price + enchantmentCost) * item.quantity;
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
