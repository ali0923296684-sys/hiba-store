"use client";

import { Sparkles, Star, Flame } from "lucide-react";

export default function ProductBadge({ product }: { product: any }) {
  if (product.created_at) {
    const days = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 60 * 60 * 24);
    if (days <= 7) {
      return (
        <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1 z-10">
          <Sparkles size={10} />جديد
        </div>
      );
    }
  }
  if (product.rating >= 4.8) {
    return (
      <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1 z-10">
        <Star size={10} />الأعلى تقييماً
      </div>
    );
  }
  if (product.badge) {
    return (
      <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-luxury-gold to-luxury-beige text-dark-900 text-[8px] font-bold rounded-full flex items-center gap-1 z-10">
        <Flame size={10} />{product.badge}
      </div>
    );
  }
  return null;
}