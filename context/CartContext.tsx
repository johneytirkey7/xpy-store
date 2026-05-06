"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void; // 🔥 Isko hum quantity kam karne ke liye use karenge
  clearCart: () => void;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('xpy_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('xpy_cart', JSON.stringify(cart));
  }, [cart]);

  // 🔥 Quantity badhane ya naya item add karne ke liye
  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, image: product.imageUrl || product.image }];
    });
  };

  // 🔥 Quantity kam karne ya item hatane ke liye (Minus Button)
  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === id);
      
      if (existingItem && existingItem.quantity > 1) {
        // Agar quantity 1 se zyada hai toh sirf 1 kam karo
        return prevCart.map(item =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // Agar quantity 1 hai, toh poora hata do
      return prevCart.filter(item => item.id !== id);
    });
  };

  const clearCart = () => setCart([]);
  const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};