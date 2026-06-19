"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Package, Truck, CheckCircle2, Loader2, Clock, MapPin, Phone, AlertCircle, ShoppingBag, MessageCircle, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTrack = async () => {
    if (!orderId.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      let searchId = orderId.trim().toUpperCase();
      if (!searchId.startsWith("#")) searchId = `#${searchId}`;

      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', searchId)
        .single();

      if (dbError || !data) {
        setError("لم نجد طلباً بهذا الرقم. تأكدي من الرقم وحاولي مرة أخرى.");
      } else {
        setOrder(data);
      }
    } catch (err) {
      setError("حدث خطأ أثناء البحث.");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = () => {
    if (order) {
      navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusStep = (status: string) => {
    if (status === "تم التوصيل") return 3;
    if (status === "في الطريق") return 2;
    return 1;
  };

  const getStatusColor = (status: string) => {
    if (status === "تم التوصيل") return "text-green-400 bg-green-500/10 border-green-500/20";
    if (status === "في الطريق") return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
  };

  const getEstimatedTime = (status: string, city: string) => {
    if (status === "تم التوصيل") return "تم التوصيل بنجاح ✅";
    if (status === "في الطريق") return "متوقع الوصول خلال 1-2 يوم 🚚";
    return "جاري التجهيز — سيتم الشحن قريباً 📦";
  };

  const steps = [
    { id: 1, label: "تم استلام الطلب", sublabel: "تم تأكيد طلبكِ", icon: Package },
    { id: 2, label: "في الطريق إليكِ", sublabel: "الطلب مع شركة التوصيل", icon: Truck },
    { id: 3, label: "تم التوصيل", sublabel: "استلمتِ طلبكِ بنجاح", icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream pt-32 pb-20">
      <div className="section-padding max-w-2xl mx-auto">

        {/* العنوان */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-full bg-luxury-beige/10 flex items-center justify-center mx-auto mb-6 border border-luxury-beige/20"
          >
            <Package className="w-9 h-9 text-luxury-beige" />
          </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 border border-luxury-beige/10 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                placeholder="مثال: M1MYHGMEB"
                className="w-full bg-dark-800 border border-white/5 rounded-xl px-6 py-4 text-center text-lg tracking-widest uppercase outline-none focus:border-luxury-beige/40 transition-colors"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-mono">#</span>
            </div>
            <button
              onClick={handleTrack}
              disabled={loading || !orderId.trim()}
              className="btn-primary px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Search size={20} /> تتبع</>}
            </button>
          </div>

          {/* نصيحة */}
          <p className="text-center text-[10px] text-white/20 mt-3">
            💡 رقم الطلب موجود في رسالة التأكيد على واتساب
          </p>
        </motion.div>

        {/* رسالة الخطأ */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-5 rounded-xl text-center mb-6"
            >
              <AlertCircle size={24} className="mx-auto mb-2" />
              <p className="text-sm font-bold mb-1">{error}</p>
              <p className="text-[11px] text-red-400/60">إذا كنتِ متأكدة من الرقم، تواصلي معنا:</p>
              <a
                href="https://wa.me/218935364926?text=السلام عليكم، أريد الاستفسار عن طلبي"
                target="_blank"
                className="inline-flex items-center gap-1 mt-2 text-xs text-green-400 hover:underline"
              >
                <MessageCircle size={14} /> تواصل على واتساب
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* عرض حالة الطلب */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="space-y-6"
            >
              {/* رقم الطلب + الحالة */}
              <div className="glass-card p-6 border border-luxury-beige/20">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">رقم الطلب</p>
                    <div className="flex items-center gap-2">
                      <button onClick={copyOrderNumber} className="p-1 text-white/20 hover:text-luxury-beige transition-colors" title="نسخ">
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                      <p className="font-mono text-2xl font-bold gold-gradient-text">{order.order_number}</p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                {/* الوقت المتوقع */}
                <div className="bg-luxury-beige/5 rounded-xl p-4 text-center border border-luxury-beige/10 mb-6">
                  <p className="text-xs text-white/40 mb-1">الحالة المتوقعة</p>
                  <p className="text-sm font-bold text-luxury-beige">
                    {getEstimatedTime(order.status, order.city)}
                  </p>
                </div>

                {/* شريط التقدم البصري */}
                <div className="relative flex justify-between items-start mb-4 px-2">
                  {/* الخط الخلفي */}
                  <div className="absolute top-6 left-6 right-6 h-1 bg-white/5 -z-0 rounded-full" />
                  {/* الخط الذهبي (التقدم) */}
                  <motion.div
                    className="absolute top-6 right-6 h-1 bg-gradient-to-l from-luxury-beige to-amber-500 -z-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStatusStep(order.status) - 1) * 50}%` }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                  />

                  {steps.map((step, i) => {
                    const isActive = getStatusStep(order.status) >= step.id;
                    const isCurrent = getStatusStep(order.status) === step.id;
                    const Icon = step.icon;
                    return (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.2 }}
                        className="relative z-10 flex flex-col items-center gap-2 w-1/3"
                      >
                        <motion.div
                          animate={isCurrent ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 
                            ${isActive
                              ? 'bg-gradient-to-br from-luxury-beige to-amber-500 text-dark-900 shadow-lg shadow-luxury-beige/30'
                              : 'bg-dark-800 text-white/20 border border-white/5'}`}
                        >
                          <Icon size={20} />
                        </motion.div>
                        <span className={`text-[10px] md:text-xs text-center font-bold transition-colors ${isActive ? 'text-luxury-cream' : 'text-white/20'}`}>
                          {step.label}
                        </span>
                        <span className={`text-[9px] text-center transition-colors ${isActive ? 'text-white/40' : 'text-white/10'}`}>
                          {step.sublabel}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* تفاصيل الطلب */}
              <div className="glass-card p-6 border border-white/5">
                <h3 className="text-sm font-bold text-luxury-cream mb-4 text-right flex items-center gap-2 justify-end">
                  تفاصيل الطلب
                  <ShoppingBag size={16} className="text-luxury-beige" />
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                    <span className="font-bold">{order.customer_name}</span>
                    <span className="text-white/40 text-xs">الاسم</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                    <span className="font-bold" dir="ltr">{order.phone}</span>
                    <span className="text-white/40 text-xs">الهاتف</span>
                  </div>
                  <div className="flex items-center justify-between text-sm py-3 border-b border-white/5">
                    <span className="font-bold">{order.city} - {order.address}</span>
                    <span className="text-white/40 text-xs">العنوان</span>
                  </div>

                  {/* المنتجات المطلوبة */}
                  {order.items && order.items.length > 0 && (
                    <div className="pt-3">
                      <p className="text-xs text-white/40 mb-3 text-right">المنتجات المطلوبة:</p>
                      <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center gap-3 bg-dark-800/50 rounded-xl p-3">
                            {item.image && (
                              <img src={item.image} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                            )}
                            <div className="flex-1 text-right min-w-0">
                              <p className="text-sm font-bold truncate">{item.name}</p>
                              <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1 justify-end">
                                {item.selectedColor && (
                                  <span className="bg-white/5 px-2 py-0.5 rounded-full">
                                    اللون: {item.selectedColor}
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="bg-white/5 px-2 py-0.5 rounded-full">
                                    المقاس: {item.selectedSize}
                                  </span>
                                )}
                                <span>× {item.quantity || 1}</span>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-luxury-beige shrink-0">
                              {formatPrice(item.price * (item.quantity || 1))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* الإجمالي */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-luxury-beige/10">
                    <span className="text-xl font-serif gold-gradient-text font-bold">
                      {formatPrice(order.total_amount || order.total_price)}
                    </span>
                    <span className="font-bold text-luxury-beige">الإجمالي</span>
                  </div>
                </div>
              </div>

              {/* أزرار التواصل */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://wa.me/218935364926?text=السلام عليكم، أريد الاستفسار عن طلبي رقم ${order.order_number}`}
                  target="_blank"
                  className="glass-card p-4 border border-green-500/20 rounded-xl flex items-center justify-center gap-2 text-green-400 text-sm font-bold hover:bg-green-500/5 transition-all"
                >
                  <MessageCircle size={18} />
                  تواصل واتساب
                </a>
                <Link
                  href="/shop"
                  className="glass-card p-4 border border-luxury-beige/20 rounded-xl flex items-center justify-center gap-2 text-luxury-beige text-sm font-bold hover:bg-luxury-beige/5 transition-all"
                >
                  <ShoppingBag size={18} />
                  تسوقي المزيد
                </Link>
              </div>

              {/* رسالة تطمين */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-xs text-white/20 mt-4"
              >
                {order.status === 'تم التوصيل'
                  ? "🎉 نتمنى أن ينال طلبكِ إعجابكِ! شكراً لثقتكِ بمتجر هبة الرحمن."
                  : "💌 شكراً لصبركِ، فريقنا يعمل على تجهيز وتوصيل طلبكِ بأقصى سرعة."}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* إذا لم يتم البحث بعد */}
        {!order && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
              <Truck className="w-10 h-10 text-white/10" />
            </div>
            <p className="text-white/20 text-sm mb-1">أدخلي رقم الطلب أعلاه</p>
            <p className="text-white/10 text-xs">ستظهر لكِ حالة الطلب وتفاصيله كاملة</p>
          </motion.div>
        )}

        {/* رابط العودة */}
        <div className="text-center mt-8">
          <Link href="/" className="text-luxury-beige/40 hover:text-luxury-beige text-sm transition-colors">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}