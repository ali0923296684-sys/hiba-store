"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

interface CartNotificationProps {
  item: { name: string; image: string; price: number; selectedColor?: string } | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function CartNotification({ item, isVisible, onClose }: CartNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && item && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-28 right-4 z-[80] w-[340px] max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-dark-900 border border-green-500/20 rounded-2xl shadow-2xl shadow-green-500/10 overflow-hidden">
            {/* الهيدر */}
            <div className="bg-green-500/10 px-4 py-2.5 flex items-center justify-between">
              <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
                <Check size={16} />
                تمت الإضافة للسلة!
              </div>
            </div>

            {/* المنتج */}
            <div className="p-4 flex items-center gap-3">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-1 text-right min-w-0">
                <p className="text-sm font-bold text-luxury-cream truncate">{item.name}</p>
                {item.selectedColor && (
                  <p className="text-[10px] text-white/40 mt-0.5">اللون: {item.selectedColor}</p>
                )}
                <p className="text-sm font-bold text-luxury-beige mt-1">{formatPrice(item.price)}</p>
              </div>
            </div>

            {/* الأزرار */}
            <div className="px-4 pb-4 flex gap-2">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-white/60 hover:bg-white/5 transition-colors">
                متابعة التسوق
              </button>
              <Link href="/checkout" className="flex-1">
                <button className="w-full py-2.5 rounded-xl bg-luxury-beige text-dark-900 text-xs font-bold flex items-center justify-center gap-1 hover:bg-luxury-gold transition-colors">
                  <ShoppingBag size={14} />
                  إتمام الشراء
                </button>
              </Link>
            </div>

            {/* شريط تقدم الإغلاق التلقائي */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 4, ease: "linear" }}
              className="h-0.5 bg-green-500/50"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}