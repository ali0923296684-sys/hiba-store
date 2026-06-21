"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Volume2, VolumeX } from "lucide-react";

interface OrderSoundProps {
  enabled: boolean;
}

export default function OrderSound({ enabled }: OrderSoundProps) {
  const [newOrder, setNewOrder] = useState<any>(null);
  const [soundOn, setSoundOn] = useState(enabled);
  const lastCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // إنشاء صوت الإشعار
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczGC1ckdnXrWMzFiRVi9fXsWY0FiFRh9XXs2g1FyBOhNTYtWo2GR9Lg9PZt2w3Gh5JgdHauW44Gx1Hf9Dbu3A5HBxFfdDcvHI6HRtDe8/dvnQ8HhpBec7fwHY+IRc/d8zixHlBJRk7ccPnyH1HKxQzbMLrzYNOMBIpYrjrz4tXQxkgUqLh0JFtZ1k+Rn3D1dCkf2hnbH1gV0Q9d2JWdYRfTDoycV5EZYxnRjIhYE1AUH1wYzwjRVA+Snt1aT0lQEo7R3d2bEEnOkQ3RHR3cEQqNj8yQHF4c0csMzsuPW55dkouspsvOmt6eE4wLTMqN2h8fFIzKi8nNGV+gFY2JyskaGKBhFo6JCchX12EiF4+ISMfW1mHjGJCHiAdV1WKkGZGGx0bU1KNlGpKGBsZT06Ql25OFhgXSkqRn3RfUBUWQkOImX90bFcTDzszcLftwH9bHAotWKjl0JR0RxkYT5TTwotmQhMNPIq/0u");

    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, []);

  // مراقبة الطلبات الجديدة كل 10 ثواني
  useEffect(() => {
    if (!soundOn) return;

    const checkNewOrders = async () => {
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      if (count && count > lastCountRef.current && lastCountRef.current > 0) {
        // طلب جديد!
        playSound();

        const { data } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setNewOrder(data);
          setTimeout(() => setNewOrder(null), 8000);
        }
      }
      if (count) lastCountRef.current = count;
    };

    // أول فحص
    checkNewOrders();

    // فحص كل 10 ثواني
    const interval = setInterval(checkNewOrders, 10000);
    return () => clearInterval(interval);
  }, [soundOn]);

  const playSound = () => {
    try {
      // صوت بيب بسيط باستخدام Web Audio API
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

      // النغمة الأولى
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.frequency.value = 880;
      osc1.type = "sine";
      gain1.gain.value = 0.3;
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.15);

      // النغمة الثانية
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.frequency.value = 1100;
      osc2.type = "sine";
      gain2.gain.value = 0.3;
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.3);

      // النغمة الثالثة (أعلى)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.frequency.value = 1320;
      osc3.type = "sine";
      gain3.gain.value = 0.3;
      osc3.start(ctx.currentTime + 0.3);
      osc3.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log("Sound not supported");
    }
  };

  return (
    <>
      {/* زر تشغيل/إيقاف الصوت */}
      <button
        onClick={() => setSoundOn(!soundOn)}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
          soundOn
            ? "bg-green-500/10 border border-green-500/20 text-green-400"
            : "bg-white/5 border border-white/10 text-white/40"
        }`}
      >
        {soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        {soundOn ? "الصوت مفعّل" : "الصوت مغلق"}
      </button>

      {/* إشعار الطلب الجديد */}
      <AnimatePresence>
        {newOrder && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-20 right-4 z-[200] w-[350px] max-w-[calc(100vw-2rem)]"
          >
            <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Bell size={20} className="text-green-400 animate-bounce" />
                </div>
                <div className="text-right flex-1">
                  <p className="text-green-400 font-bold text-sm">🎉 طلب جديد!</p>
                  <p className="text-green-400/60 text-[10px]">الآن</p>
                </div>
              </div>
              <div className="bg-dark-900/50 rounded-xl p-3 text-right space-y-1">
                <p className="text-luxury-cream text-sm font-bold">{newOrder.customer_name}</p>
                <p className="text-white/40 text-xs">{newOrder.city} - {newOrder.phone}</p>
                <p className="text-luxury-beige font-bold text-sm">
                  {newOrder.total_amount || newOrder.total_price} د.ل
                </p>
              </div>
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 8, ease: "linear" }}
                className="h-[2px] bg-green-500/30 mt-3 rounded-full"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}