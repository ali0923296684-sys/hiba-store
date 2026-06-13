"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { products as initialProducts } from "@/lib/data";

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  editProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  stats: Stats;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  items: { name: string; quantity: number; price: number; color?: string; size?: string }[];
  total: number;
  status: OrderStatus;
  date: string;
  notes?: string;
  paymentMethod: string;
}

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem("hiba_products");
    const savedOrders = localStorage.getItem("hiba_orders");
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("hiba_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("hiba_orders", JSON.stringify(orders));
  }, [orders]);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts((prev) => [...prev, { ...product, id: newId }]);
  }, [products]);

  const editProduct = useCallback((id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date" | "status">) => {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const stats: Stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter((o) => o.status === "pending").length,
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        editProduct,
        deleteProduct,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        stats,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
