"use client";

import { motion } from "framer-motion";
import { Palette, Footprints, Gem, Sparkles, Lightbulb } from "lucide-react";
import { fashionTips } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="w-6 h-6" />,
  Footprints: <Footprints className="w-6 h-6" />,
  Gem: <Gem className="w-6 h-6" />,
  Sparkles: <Sparkles className="w-6 h-6" />,
};

export default function FashionTipsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-beige/[0.01] to-transparent" />

      <div className="relative max-w-[1500px] mx-auto section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/5 border border-luxury-beige/10 text-luxury-beige text-sm mb-6"
          >
            <Lightbulb className="w-4 h-4" />
            نصائح سريعة
          </motion.span>

          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-luxury-cream mb-4">
            قواعد <span className="gold-gradient-text">الأناقة</span>
          </h2>
        </motion.div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {fashionTips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 30, rotateY: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="glass-card-hover p-8 text-center group perspective-1000"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.2 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-luxury-beige/15 to-luxury-gold/5 flex items-center justify-center text-luxury-beige border border-luxury-beige/10 group-hover:border-luxury-beige/30 transition-all"
              >
                {iconMap[tip.icon]}
              </motion.div>

              <h3 className="font-serif text-xl font-bold text-luxury-cream mb-3 group-hover:text-luxury-beige transition-colors">
                {tip.title}
              </h3>
              <p className="text-luxury-cream/40 text-sm leading-relaxed">
               {tip.description}
                </p>

              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-luxury-beige/10 flex items-center justify-center text-luxury-beige/30 text-xs font-bold border border-luxury-beige/10">
                0{tip.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
