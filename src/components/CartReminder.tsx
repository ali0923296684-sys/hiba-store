"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartReminder() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    if (totalItems === 0 || dismissed) return;

    const timer = setTimeout(() => {
      setShow(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [totalItems, dismissed]);

  useEffect(() => {
    if (show) {
      const autoHide = setTimeout(() => setShow(false), 10000);
      return () => clearTimeout(autoHide);
    }
  }, [show]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {show && totalItems > 0 && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed bottom-24 right-4 z-[85] w-[320px] max-w-[calc(100vw-2rem)]"
        >
          <div className="bg-dark-900 border border-luxury-beige/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-4 py-2.5 flex items-center justify-between">
              <button onClick={handleDismiss} className="text-white/30 hover:text-white/60">
                <X size={16} />
              </button>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <ShoppingBag size={14} />
                نسيتِ سلتك! 🛍️
              </div>
            </div>

            <div className="p-4 text-right">
              <p className="text-sm text-luxury-cream mb-1">
                عندكِ <span className="text-luxury-beige font-bold">{totalItems} منتج</span> في السلة
              </p>
              <p className="text-xs text-white/40 mb-3">
                أكملي طلبك قبل نفاد الكمية!
              </p>

              <Link href="/checkout" onClick={handleDismiss}>
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-luxury-beige to-amber-500 text-dark-900 text-sm font-bold flex items-center justify-center gap-2">
                  <ArrowLeft size={14} />
                  إتمام الشراء الآن
                </button>
              </Link>
            </div>

            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 10, ease: "linear" }}
              className="h-0.5 bg-luxury-beige/50"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}