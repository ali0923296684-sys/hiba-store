"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { TrendingUp, ArrowUpRight, Sparkles } from "lucide-react";
import { trends2026 } from "@/lib/data";

export default function FashionTrends() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={containerRef} id="trends" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-luxury-beige/[0.015] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-luxury-gold/[0.01] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/5 border border-luxury-beige/10 text-luxury-beige text-sm mb-6"
          >
            <TrendingUp className="w-4 h-4" />
            صيحات 2026
          </motion.span>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
            أبرز <span className="gold-gradient-text text-shadow-gold">الترندات</span>
          </h2>
          <p className="text-luxury-cream/40 text-lg max-w-2xl mx-auto leading-relaxed">
            اكتشفي أحدث صيحات الإكسسوارات العالمية لعام 2026، من المجوهرات الضخمة إلى الحقائب المنسوجة
          </p>
        </motion.div>

        {/* Trends Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trends2026.map((trend, i) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative glass-card-hover overflow-hidden cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <motion.img
                  src={trend.image}
                  alt={trend.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/30 to-transparent" />

                <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/10 backdrop-blur-sm border border-luxury-beige/20 text-luxury-beige text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  Trend 2026
                </div>
              </div>

              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-luxury-cream mb-3 group-hover:text-luxury-beige transition-colors">
                  {trend.title}
                </h3>
                <p className="text-luxury-cream/50 leading-relaxed mb-4">
                  {trend.description}
                </p>
                <div className="flex items-center gap-2 text-luxury-beige text-sm font-medium group-hover:gap-3 transition-all">
                  اكتشفي المزيد
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fashion Quote */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="glass-card p-12 max-w-4xl mx-auto relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-luxury-beige/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-luxury-beige" />
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl text-luxury-cream/80 leading-relaxed italic mb-6">
              "الإكسسوارات هي اللمسة الأخيرة التي تحول الملابس إلى إطلالة، والإطلالة إلى أسلوب حياة"
            </blockquote>
            <cite className="text-luxury-beige/60 text-sm not-italic">
              — دار هبة الرحمن
            </cite>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
