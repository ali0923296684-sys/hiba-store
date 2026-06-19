"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";

interface CountdownTimerProps {
  endDate: string;
  label?: string;
  size?: "small" | "large";
}

export default function CountdownTimer({ endDate, label = "ينتهي العرض خلال", size = "small" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (isExpired) return null;

  if (size === "small") {
    return (
      <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-bold">
        <Clock size={10} className="animate-pulse" />
        <span>{timeLeft.days > 0 ? `${timeLeft.days}ي ` : ""}{String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-2xl p-4 text-center"
    >
      <div className="flex items-center justify-center gap-2 text-red-400 text-sm font-bold mb-3">
        <Flame size={16} className="animate-pulse" />
        <span>{label}</span>
      </div>
      <div className="flex justify-center gap-3">
        {[
          { value: timeLeft.days, label: "يوم" },
          { value: timeLeft.hours, label: "ساعة" },
          { value: timeLeft.minutes, label: "دقيقة" },
          { value: timeLeft.seconds, label: "ثانية" },
        ].map((item) => (
          <div key={item.label} className="bg-dark-900/50 rounded-xl px-3 py-2 min-w-[50px]">
            <div className="text-xl font-bold text-red-400 font-mono">
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="text-[8px] text-white/30">{item.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}