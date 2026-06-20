"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

export default function ViewersCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(Math.floor(Math.random() * 20) + 5);

    const interval = setInterval(() => {
      setCount(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(3, Math.min(35, newCount));
      });
    }, 5000 + Math.random() * 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2"
    >
      <div className="relative">
        <Eye size={16} className="text-red-400" />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      </div>
      <span className="text-red-400 text-xs font-bold">
        {count} شخص يشاهد هذا المنتج الآن
      </span>
    </motion.div>
  );
}