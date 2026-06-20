"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Gift, Sparkles } from "lucide-react";

export default function EmailPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    // تحقق إذا المستخدم اشترك مسبقاً أو أغلق النافذة
    const closed = localStorage.getItem("hiba_popup_closed");
    const already = localStorage.getItem("hiba_subscribed");
    if (closed || already) return;

    // إظهار بعد 20 ثانية
    const timer = setTimeout(() => setShow(true), 20000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    localStorage.setItem("hiba_popup_closed", "true");
  };

  const handleSubscribe = () => {
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    localStorage.setItem("hiba_subscribed", email);

    // يمكنك إضافة حفظ الإيميل في Supabase هنا
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={e => e.stopPropagation()}
            className="bg-dark-900 border border-luxury-beige/20 rounded-3xl p-6 max-w-sm w-full relative overflow-hidden"
          >
            {/* خلفية */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-luxury-beige/10 to-transparent pointer-events-none" />

            {/* زر الإغلاق */}
            <button onClick={handleClose} className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white/80 z-10">
              <X size={16} />
            </button>

            {subscribed ? (
              <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-6 relative z-10">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={36} className="text-green-400" />
                </div>
                <h3 className="text-xl font-serif font-bold text-luxury-cream mb-2">تم الاشتراك! 🎉</h3>
                <p className="text-white/40 text-sm">ترقبي أحلى العروض في إيميلك</p>
              </motion.div>
            ) : (
              <div className="relative z-10 text-center">
                {/* الأيقونة */}
                <div className="w-16 h-16 rounded-full bg-luxury-beige/10 flex items-center justify-center mx-auto mb-4 border border-luxury-beige/20">
                  <Gift size={28} className="text-luxury-beige" />
                </div>

                <h3 className="text-xl font-serif font-bold text-luxury-cream mb-2">
                  احصلي على <span className="gold-gradient-text">خصم 10%</span>
                </h3>
                <p className="text-white/40 text-sm mb-6">
                  اشتركي بالإيميل واحصلي على خصم فوري + عروض حصرية!
                </p>

                {/* حقل الإيميل */}
                <div className="space-y-3">
                  <div className="relative">
                    <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSubscribe()}
                      placeholder="أدخلي إيميلك هنا"
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 pr-10 py-3.5 text-right outline-none focus:border-luxury-beige/40 text-sm"
                    />
                  </div>

                  <button
                    onClick={handleSubscribe}
                    disabled={!email.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-luxury-beige to-amber-500 text-dark-900 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:shadow-lg hover:shadow-luxury-beige/20 transition-all"
                  >
                    <Gift size={16} />
                    اشتركي واحصلي على الخصم
                  </button>
                </div>

                <p className="text-white/15 text-[9px] mt-4">لن نشارك إيميلك مع أي طرف ثالث</p>

                <button onClick={handleClose} className="text-white/20 text-[10px] mt-2 hover:text-white/40">
                  لا شكراً، متابعة التسوق
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}