"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, Check, X } from "lucide-react";

export default function NotifyMe({ productName, productId }: { productName: string; productId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = () => {
    if (!phone.trim()) return;
    const list = JSON.parse(localStorage.getItem("hiba_notifications") || "[]");
    list.push({ productId, productName, phone, date: new Date().toISOString() });
    localStorage.setItem("hiba_notifications", JSON.stringify(list));
    setDone(true);
    setTimeout(() => { setIsOpen(false); setDone(false); setPhone(""); }, 2000);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-full py-3 rounded-xl border-2 border-dashed border-amber-500/30 text-amber-400 text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-500/5">
        <Bell size={16} />نبّهيني عند التوفر
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80" onClick={() => setIsOpen(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="bg-dark-900 border border-luxury-beige/20 rounded-3xl p-6 max-w-sm w-full">
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setIsOpen(false)}><X size={20} className="text-white/30" /></button>
                <h3 className="text-lg font-serif font-bold">🔔 تنبيه التوفر</h3>
              </div>
              {done ? (
                <div className="text-center py-8">
                  <Check size={32} className="text-green-400 mx-auto mb-3" />
                  <p className="text-green-400 font-bold">تم التسجيل! ✅</p>
                </div>
              ) : (
                <div className="space-y-4 text-right">
                  <p className="text-sm text-white/60">سنرسل لكِ رسالة عند توفر:</p>
                  <p className="text-luxury-beige font-bold text-sm">{productName}</p>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الواتساب" className="w-full bg-dark-800 border border-white/10 rounded-xl px-4 py-3 text-right outline-none text-sm" />
                  <button onClick={handleSubmit} disabled={!phone.trim()} className="w-full py-3 rounded-xl bg-luxury-beige text-dark-900 font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40">
                    <BellRing size={16} />سجّليني
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}