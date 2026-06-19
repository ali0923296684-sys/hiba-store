"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface FavoritesContextType {
  favoriteIds: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // استرجاع المفضلات المحفوظة عند فتح الموقع
  useEffect(() => {
    const saved = localStorage.getItem("favorite_products");
    if (saved) setFavoriteIds(JSON.parse(saved));
  }, []);

  // حفظ المفضلات في المتصفح تلقائيا
  useEffect(() => {
    localStorage.setItem("favorite_products", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  const toggleFavorite = (id: number) => {
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    )
  }

  const isFavorite = (id: number) => favoriteIds.includes(id);
  const clearFavorites = () => setFavoriteIds([]);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error("useFavorites must be used within FavoritesProvider");
  return context;
}