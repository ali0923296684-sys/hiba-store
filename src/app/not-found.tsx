"use client";

import { motion } from "framer-motion";
import { Home, ShoppingBag, Search, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-4">
      {/* خلفية */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-beige/[0.03] rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/[0.03] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* التاج */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0], y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="inline-block"
          >
            <Crown className="w-16 h-16 text-luxury-beige/30 mx-auto" />
          </motion.div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="font-serif text-[120px] md:text-[180px] font-bold leading-none gold-gradient-text opacity-20">
            404
          </h1>
        </motion.div>

        {/* النص */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="-mt-8 md:-mt-12"
        >
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-luxury-cream mb-3">
            الصفحة غير موجودة
          </h2>
          <p className="text-white/40 text-sm md:text-base mb-8 leading-relaxed">
            عذراً، الصفحة اللي تبحثين عنها غير موجودة أو تم نقلها.
            <br />
            لكن لا تقلقي، منتجاتنا الفخمة بانتظارك! 💎
          </p>
        </motion.div>

        {/* الأزرار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-3"
        >
          <Link href="/">
            <button className="w-full py-4 rounded-2xl bg-luxury-beige text-dark-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-luxury-gold transition-all active:scale-95">
              <Home size={18} />
              العودة للرئيسية
            </button>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/shop">
              <button className="w-full py-3.5 rounded-xl border border-luxury-beige/20 text-luxury-beige text-sm font-bold flex items-center justify-center gap-2 hover:bg-luxury-beige/5 transition-all">
                <ShoppingBag size={16} />
                المتجر
              </button>
            </Link>
            <Link href="/track">
              <button className="w-full py-3.5 rounded-xl border border-luxury-beige/20 text-luxury-beige text-sm font-bold flex items-center justify-center gap-2 hover:bg-luxury-beige/5 transition-all">
                <Search size={16} />
                تتبع طلب
              </button>
            </Link>
          </div>
        </motion.div>

        {/* رابط واتساب */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <a
            href="https://wa.me/218935364926"
            target="_blank"
            className="inline-flex items-center gap-2 text-green-400/60 hover:text-green-400 text-xs transition-colors"
          >
            <ArrowRight size={12} />
            تحتاجين مساعدة؟ راسلينا على واتساب
          </a>
        </motion.div>
      </div>
    </div>
  );
}