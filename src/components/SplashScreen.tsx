"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const seen = sessionStorage.getItem("hiba_splash_seen");
    if (seen) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("hiba_splash_seen", "true");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center"
        >
          <div className="text-center">
            {/* التاج المتحرك */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 1, delay: 0.2 }}
              className="mb-6"
            >
              <div className="relative inline-block">
                <Crown className="w-16 h-16 text-luxury-beige" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 blur-2xl bg-luxury-beige/30"
                />
              </div>
            </motion.div>

            {/* اسم المتجر */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-2"
            >
              هبة الرحمن
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-luxury-beige/40 text-[10px] tracking-[0.5em] uppercase"
            >
              Luxury Store
            </motion.p>

            {/* شريط التحميل */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-10 w-48 mx-auto"
            >
              <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-luxury-beige to-amber-400 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}