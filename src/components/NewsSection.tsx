"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, TrendingUp } from "lucide-react";
import { newsItems } from "@/lib/data";

export default function NewsSection() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section id="news" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-luxury-beige/[0.015] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-luxury-gold/[0.01] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-30" />
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
            المدونة
          </motion.span>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
            أحدث <span className="gold-gradient-text text-shadow-gold">الأخبار</span>
          </h2>
          <p className="text-luxury-cream/40 text-lg max-w-xl mx-auto leading-relaxed">
            تابعي آخر المستجدات والتوجهات في عالم الموضة الفاخرة
          </p>
        </motion.div>

        {/* News Grid - Magazine Style */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {newsItems.map((item, i) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative glass-card-hover overflow-hidden cursor-pointer ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${i === 0 ? "aspect-[16/10] lg:aspect-auto lg:h-full" : "aspect-[16/10]"}`}>
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredId === item.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />

                {/* Date Badge */}
                <div className="absolute top-5 right-5 flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900/60 backdrop-blur-sm border border-luxury-beige/10 text-luxury-cream/70 text-xs">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString("ar-LY", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>

                {/* Read Time */}
                <div className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-beige/10 text-luxury-beige text-xs">
                  <Clock className="w-3 h-3" />
                  5 دقائق
                </div>

                {/* Content Overlay */}
                <div className={`absolute bottom-0 left-0 right-0 p-6 lg:p-8 ${i === 0 ? "lg:p-10" : ""}`}>
                  <motion.h3
                    className={`font-serif font-bold text-luxury-cream mb-3 group-hover:text-luxury-beige transition-colors duration-500 ${
                      i === 0 ? "text-2xl lg:text-3xl" : "text-xl"
                    }`}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    animate={{
                      opacity: hoveredId === item.id ? 1 : 0.7,
                      y: hoveredId === item.id ? 0 : 5,
                    }}
                    className="text-luxury-cream/50 leading-relaxed mb-4 line-clamp-2"
                  >
                    {item.excerpt}
                  </motion.p>
                  <motion.div
                    animate={{
                      x: hoveredId === item.id ? 5 : 0,
                    }}
                    className="flex items-center gap-2 text-luxury-beige text-sm font-medium"
                  >
                    اقرئي المزيد
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </motion.div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
