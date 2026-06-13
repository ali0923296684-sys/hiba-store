"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Loader2, Clock, MapPin, Phone, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      // البحث عن الطلب (نضيف # تلقائياً إذا لم يكتبها الزبون)
      const searchId = orderId.startsWith("#") ? orderId : `#${orderId}`;
      
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', searchId.toUpperCase())
        .single();

      if (dbError || !data) {
        setError("لم نجد طلباً بهذا الرقم. يرجى التأكد من الرقم والمحاولة مرة أخرى.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث.");
    } finally {
      setLoading(false);
    }
  };

  // تحديد مراحل التتبع بناءً على حالة الطلب
  const getStatusStep = (status: string) => {
    if (status === "تم التوصيل") return 3;
    if (status === "في الطريق") return 2;
    return 1; // جاري التجهيز
  };

  const steps = [
    { id: 1, label: "تم استلام الطلب", icon: Package },
    { id: 2, label: "في الطريق إليك", icon: Truck },
    { id: 3, label: "تم التوصيل", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream pt-32 pb-20">
      <div className="section-padding max-w-2xl mx-auto">
        
        {/* العنوان */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            تتبع <span className="gold-gradient-text">طلبكِ</span>
          </motion.h1>
          <p className="text-luxury-cream/40">أدخلي رقم الطلب لمعرفة حالته ومكانه الحالي</p>
        </div>

        {/* مربع البحث */}
        <div className="glass-card p-6 border border-luxury-beige/10 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
              placeholder="مثال: M1MYHGMEB"
              className="flex-1 bg-dark-800 border border-white/5 rounded-xl px-6 py-4 text-center text-lg tracking-widest uppercase outline-none focus:border-luxury-beige transition-colors"
            />
            <button 
              onClick={handleTrack}
              disabled={loading}
              className="btn-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Search size={20}/> تتبع</>}
            </button>
          </div>
        </div>

        {/* رسالة الخطأ */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* عرض حالة الطلب */}
        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 border border-luxury-beige/20"
            >
              {/* رقم الطلب */}
              <div className="text-center mb-10 pb-6 border-b border-white/5">
                <p className="text-xs text-white/40 uppercase tracking-widest mb-2">رقم الطلب</p>
                <p className="font-mono text-2xl font-bold gold-gradient-text">{order.order_number}</p>
              </div>

              {/* شريط التقدم البصري */}
              <div className="relative flex justify-between items-center mb-12">
                {/* الخط الخلفي */}
                <div className="absolute top-6 left-0 right-0 h-1 bg-white/5 -z-0" />
                {/* الخط الذهبي (التقدم) */}
                <div 
                  className="absolute top-6 right-0 h-1 bg-luxury-beige -z-0 transition-all duration-1000"
                  style={{ width: `${(getStatusStep(order.status) - 1) * 50}%` }}
                />

                {steps.map((step) => {
                  const isActive = getStatusStep(order.status) >= step.id;
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 w-1/3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-luxury-beige text-dark-900 scale-110 shadow-lg shadow-luxury-beige/30' : 'bg-dark-800 text-white/30'}`}>
                        <Icon size={20} />
                      </div>
                      <span className={`text-[10px] md:text-xs text-center transition-colors ${isActive ? 'text-luxury-beige font-bold' : 'text-white/30'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* تفاصيل الطلب */}
              <div className="bg-dark-800/50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="text-luxury-beige" size={18} />
                  <span className="opacity-60">الحالة الحالية:</span>
                  <span className="font-bold text-luxury-beige">{order.status}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="text-luxury-beige" size={18} />
                  <span className="opacity-60">عنوان التوصيل:</span>
                  <span className="font-bold">{order.city}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Package className="text-luxury-beige" size={18} />
                  <span className="opacity-60">قيمة الطلب:</span>
                  <span className="font-bold">{formatPrice(order.total_amount || order.total_price)}</span>
                </div>
              </div>

              {/* رسالة تطمين */}
              <p className="text-center text-xs text-white/30 mt-6">
                {order.status === 'تم التوصيل' 
                  ? "🎉 نتمنى أن ينال طلبكِ إعجابكِ! شكراً لثقتكِ." 
                  : "💌 شكراً لصبركِ، فريقنا يعمل على تجهيز وتوصيل طلبكِ بأقصى سرعة."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* رابط العودة */}
        <div className="text-center mt-8">
          <Link href="/" className="text-luxury-beige/60 hover:text-luxury-beige text-sm transition-colors">
            → العودة للتسوق
          </Link>
        </div>
      </div>
    </div>
  );
}