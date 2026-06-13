"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { CartItem, Product } from "@/types";

// مفتاح فريد لكل عنصر
function getCartItemKey(item: { id: number; selectedColor?: string; selectedSize?: string }): string {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product & { selectedColor?: string; selectedSize?: string }) => void;
  removeFromCart: (cartItemId: string) => void;   // الآن يأخذ string
  updateQuantity: (cartItemId: string, quantity: number) => void; // يأخذ string
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // تحميل من localStorage
  useEffect(() => {
    const saved = localStorage.getItem("hiba-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
    setHasLoaded(true);
  }, []);

  // حفظ في localStorage
  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem("hiba-cart", JSON.stringify(items));
  }, [items, hasLoaded]);

  const addToCart = useCallback((product: Product & { selectedColor?: string; selectedSize?: string }) => {
    const newItem: CartItem = {
      ...product,
      quantity: 1,
      selectedColor: product.selectedColor,
      selectedSize: product.selectedSize,
    };
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => getCartItemKey(item) === getCartItemKey(newItem)
      );
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [...prev, newItem];
    });
    // setIsCartOpen(true); // اختياري
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((item) => getCartItemKey(item) !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        getCartItemKey(item) === cartItemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}