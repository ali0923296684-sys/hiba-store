"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

export default function PushNotification() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<string>("default");

  useEffect(() => {
    if (!("Notification" in window)) return;
    setPermission(Notification.permission);

    if (Notification.permission === "default") {
      const dismissed = localStorage.getItem("hiba_push_dismissed");
      if (!dismissed) {
        setTimeout(() => setShow(true), 15000);
      }
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === "granted") {
      new Notification("هبة الرحمن 🌸", {
        body: "تم تفعيل الإشعارات! ستصلكِ أحدث العروض",
        icon: "/icons/icon-192.png",
      });
    }
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    localStorage.setItem("hiba_push_dismissed", "true");
  };

  if (permission === "granted") return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-28 left-4 right-4 md:left-auto md:right-4 md:w-[320px] z-[85]"
        >
          <div className="bg-dark-900 border border-luxury-beige/20 rounded-2xl p-4 shadow-2xl">
            <button onClick={dismiss} className="absolute top-3 left-3 text-white/30 hover:text-white/60">
              <X size={16} />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-luxury-beige/10 flex items-center justify-center">
                <Bell size={20} className="text-luxury-beige" />
              </div>
              <div className="text-right flex-1">
                <p className="text-luxury-cream font-bold text-sm">لا تفوتي العروض! 🎉</p>
                <p className="text-white/40 text-[10px]">فعّلي الإشعارات لتصلكِ العروض الحصرية</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={dismiss} className="flex-1 py-2 rounded-xl border border-white/10 text-white/40 text-xs font-bold">
                لاحقاً
              </button>
              <button onClick={requestPermission} className="flex-1 py-2 rounded-xl bg-luxury-beige text-dark-900 text-xs font-bold">
                تفعيل 🔔
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}