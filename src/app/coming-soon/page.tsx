"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // عداد تنازلي — غيّر التاريخ حسب موعد الإطلاق
  useEffect(() => {
    const launchDate = new Date("2025-08-01T00:00:00").getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = launchDate - now;
      if (diff <= 0) { clearInterval(timer); return; }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = () => {
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream flex items-center justify-center relative overflow-hidden">
      {/* خلفية */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-beige/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/10 border border-luxury-beige/20 text-luxury-beige text-xs mb-8">
            <Sparkles size={14} />
            قريباً جداً
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            مجموعة <span className="gold-gradient-text">جديدة</span>
          </h1>

          <p className="text-luxury-cream/40 text-lg mb-12 leading-relaxed">
            تشكيلة حصرية من أرقى المنتجات الفاخرة قادمة قريباً. كوني أول من يعرف!
          </p>

          {/* العداد التنازلي */}
          <div className="grid grid-cols-4 gap-4 mb-12 max-w-md mx-auto">
            {[
              { value: countdown.days, label: "يوم" },
              { value: countdown.hours, label: "ساعة" },
              { value: countdown.minutes, label: "دقيقة" },
              { value: countdown.seconds, label: "ثانية" },
            ].map((item) => (
              <motion.div key={item.label} className="glass-card p-4 border border-luxury-beige/10">
                <div className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] text-white/30 mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>

          {/* اشتراك */}
          {subscribed ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-green-400">
              <Bell size={32} className="mx-auto mb-3" />
              <p className="font-bold">تم التسجيل بنجاح! 🎉</p>
              <p className="text-xs text-green-400/60 mt-1">سنرسل لكِ إشعار عند الإطلاق</p>
            </motion.div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="أدخلي إيميلك للتنبيه"
                className="flex-1 bg-dark-800 border border-white/10 rounded-xl px-4 py-4 text-right outline-none focus:border-luxury-beige/40"
              />
              <button onClick={handleSubscribe} className="btn-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                <Bell size={18} />
                نبّهيني
              </button>
            </div>
          )}

          <Link href="/" className="inline-flex items-center gap-2 text-luxury-beige/40 hover:text-luxury-beige text-sm mt-8 transition-colors">
            <ArrowRight size={14} />
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    </div>
  );
}