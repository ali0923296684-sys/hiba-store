"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShoppingBag, Users, Award, Truck } from "lucide-react";

function AnimatedNumber({ target, duration = 2 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export default function WhyUs() {
  const stats = [
    { icon: ShoppingBag, value: 500, suffix: "+", label: "منتج فاخر", color: "text-luxury-beige" },
    { icon: Users, value: 10000, suffix: "+", label: "عميلة سعيدة", color: "text-pink-400" },
    { icon: Award, value: 50, suffix: "+", label: "علامة تجارية", color: "text-amber-400" },
    { icon: Truck, value: 99, suffix: "%", label: "نسبة الرضا", color: "text-green-400" },
  ];

  return (
    <section className="py-12 md:py-16 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-[1500px] mx-auto section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <Icon size={24} className={`${stat.color} mx-auto mb-3 opacity-60`} />
                <div className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text mb-1">
                  <AnimatedNumber target={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}