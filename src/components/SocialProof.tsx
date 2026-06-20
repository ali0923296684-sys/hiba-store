"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, MapPin } from "lucide-react";

const fakeOrders = [
  { name: "سارة", city: "طرابلس", product: "ساعة ORSGA الفاخرة", time: "قبل 3 دقائق" },
  { name: "مريم", city: "بنغازي", product: "عطر مسك الليل", time: "قبل 5 دقائق" },
  { name: "فاطمة", city: "مصراتة", product: "حقيبة جلد طبيعي", time: "قبل 8 دقائق" },
  { name: "نورا", city: "طرابلس", product: "طقم إكسسوارات ذهبي", time: "قبل 12 دقيقة" },
  { name: "آمنة", city: "الزاوية", product: "نظارة شمسية فاخرة", time: "قبل 15 دقيقة" },
  { name: "هند", city: "زليتن", product: "عطر فرنسي أصلي", time: "قبل 20 دقيقة" },
  { name: "ليلى", city: "سبها", product: "ساعة يد أنيقة", time: "قبل 25 دقيقة" },
  { name: "رانيا", city: "طرابلس", product: "حقيبة كتف فاخرة", time: "قبل 30 دقيقة" },
  { name: "سلمى", city: "بنغازي", product: "سلسلة ذهبية", time: "قبل 35 دقيقة" },
  { name: "دنيا", city: "مصراتة", product: "طقم عطور مميز", time: "قبل 40 دقيقة" },
];

export default function SocialProof() {
  const [show, setShow] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // أول إشعار بعد 10 ثواني
    const firstTimer = setTimeout(() => {
      setShow(true);
    }, 10000);

    return () => clearTimeout(firstTimer);
  }, [dismissed]);

  useEffect(() => {
    if (!show || dismissed) return;

    // إخفاء بعد 5 ثواني
    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 5000);

    // إشعار جديد كل 30-60 ثانية
    const nextTimer = setTimeout(() => {
      setCurrentOrder(prev => (prev + 1) % fakeOrders.length);
      setShow(true);
    }, 30000 + Math.random() * 30000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [show, currentOrder, dismissed]);

  const order = fakeOrders[currentOrder];

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-24 left-4 z-[80] max-w-[300px]"
        >
          <div className="bg-dark-900/95 backdrop-blur-xl border border-luxury-beige/20 rounded-2xl p-3.5 shadow-2xl">
            <button
              onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 text-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              {/* أيقونة */}
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                <ShoppingBag size={18} className="text-green-400" />
              </div>

              {/* المعلومات */}
              <div className="text-right min-w-0">
                <p className="text-xs text-luxury-cream font-bold truncate">
                  {order.name} اشترت 🛍️
                </p>
                <p className="text-[10px] text-luxury-beige truncate">{order.product}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <MapPin size={8} className="text-white/30" />
                  <span className="text-[9px] text-white/30">{order.city} • {order.time}</span>
                </div>
              </div>
            </div>

            {/* شريط تقدم */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-[2px] bg-green-500/30 mt-2.5 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}