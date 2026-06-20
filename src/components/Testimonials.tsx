"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const reviews = [
  { id: 1, name: "فاطمة أحمد", city: "طرابلس", rating: 5, text: "منتجات رائعة وجودة عالية! التوصيل كان سريع جداً والتغليف أنيق. شكراً هبة الرحمن 💕", date: "منذ أسبوع" },
  { id: 2, name: "مريم محمد", city: "بنغازي", rating: 5, text: "ساعة ORSGA جميلة جداً! نفس الصورة بالضبط. أنصح الكل يشتري من هنا ⭐", date: "منذ أسبوعين" },
  { id: 3, name: "نورا علي", city: "مصراتة", rating: 5, text: "العطر ثابت ورائحته فخمة! خدمة العملاء ممتازة وسريعة الرد 🌸", date: "منذ 3 أسابيع" },
  { id: 4, name: "سارة حسن", city: "طرابلس", rating: 5, text: "الحقيبة جلد طبيعي وجودة عالية. سعر ممتاز مقارنة بالسوق 👜", date: "منذ شهر" },
  { id: 5, name: "آمنة خالد", city: "الزاوية", rating: 5, text: "طقم الإكسسوارات كهدية لأختي وعجبها كثير! التغليف كان فخم 🎁", date: "منذ شهر" },
  { id: 6, name: "هند سالم", city: "زليتن", rating: 5, text: "ثاني مرة أطلب وكل مرة أفضل من قبلها. موقع موثوق 100% ✅", date: "منذ شهرين" },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs mb-4">
            <Star className="w-4 h-4 fill-current" />
            آراء عملائنا
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            ماذا قالت <span className="gold-gradient-text">زبوناتنا</span>
          </h2>
        </motion.div>

        {/* الكاروسيل */}
        <div className="relative max-w-2xl mx-auto">
          <motion.div key={current} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="glass-card p-8 md:p-10 border border-luxury-beige/10 text-center">
            <Quote size={32} className="text-luxury-beige/20 mx-auto mb-6" />
            
            <div className="flex justify-center gap-1 mb-4">
              {Array.from({ length: reviews[current].rating }).map((_, i) => (
                <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>

            <p className="text-luxury-cream/80 text-base md:text-lg leading-relaxed mb-6 font-medium">
              "{reviews[current].text}"
            </p>

            <div>
              <p className="font-bold text-luxury-cream text-sm">{reviews[current].name}</p>
              <p className="text-luxury-beige/60 text-xs">{reviews[current].city} • {reviews[current].date}</p>
            </div>
          </motion.div>

          {/* أزرار التنقل */}
          <button onClick={prev} className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-12 w-10 h-10 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-white/40 hover:text-luxury-beige hover:border-luxury-beige/30 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-12 w-10 h-10 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-white/40 hover:text-luxury-beige hover:border-luxury-beige/30 transition-all">
            <ChevronRight size={20} />
          </button>

          {/* النقاط */}
          <div className="flex justify-center gap-2 mt-6">
            {reviews.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-luxury-beige w-6" : "bg-white/20"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}