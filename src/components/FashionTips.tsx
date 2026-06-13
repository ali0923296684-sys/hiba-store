"use client";

import { motion } from "framer-motion";
import { Star, Scale, Layers, MapPin, Lightbulb, BookOpen } from "lucide-react";
import { fashionTips } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  Star: <Star className="w-6 h-6" />,
  Scale: <Scale className="w-6 h-6" />,
  Layers: <Layers className="w-6 h-6" />,
  MapPin: <MapPin className="w-6 h-6" />,
};

export default function FashionTips() {
  return (
    <section id="tips" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-luxury-beige/[0.015] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-luxury-gold/[0.01] rounded-full blur-[120px]" />
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
            <Lightbulb className="w-4 h-4" />
            دليل الأناقة
          </motion.span>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
            نصائح <span className="gold-gradient-text text-shadow-gold">الإكسسوارات</span>
          </h2>
          <p className="text-luxury-cream/40 text-lg max-w-2xl mx-auto leading-relaxed">
            تعلمي فن اختيار وترتيب الإكسسوارات لتكملي أناقتكِ بأسلوب عالمي
          </p>
        </motion.div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fashionTips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group glass-card-hover p-8 relative overflow-hidden"
            >
              {/* Number */}
              <div className="absolute top-6 left-6 font-serif text-6xl font-bold text-luxury-beige/5 group-hover:text-luxury-beige/10 transition-colors">
                0{tip.id}
              </div>

              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-luxury-beige/10 to-luxury-gold/5 flex items-center justify-center text-luxury-beige mb-6 group-hover:scale-110 transition-transform duration-300 border border-luxury-beige/10">
                  {iconMap[tip.icon]}
                </div>

                <h3 className="font-serif text-2xl font-bold text-luxury-cream mb-4 group-hover:text-luxury-beige transition-colors">
                  {tip.title}
                </h3>
                <p className="text-luxury-cream/50 leading-relaxed text-lg">
                  {tip.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 glass-card p-10 max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-luxury-beige/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-7 h-7 text-luxury-beige" />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-luxury-cream mb-4">
                لماذا الإكسسوارات مهمة؟
              </h3>
              <p className="text-luxury-cream/50 leading-relaxed text-lg mb-4">
                الإكسسوارات ليست مجرد إضافات، بل هي العنصر الذي يحدد هوية إطلالتكِ. 
                في عالم الموضة لعام 2026، تشهد الإكسسوارات ثورة حقيقية - من المجوهرات الضخمة (Statement Jewellery) 
                التي تتحدث عن نفسها، إلى الحقائب المنسوجة (Woven Bags) التي تعيد اكتشاف الحرفية التقليدية.
              </p>
              <p className="text-luxury-cream/50 leading-relaxed text-lg">
                صيحة Layering المجوهرات أصبحت فناً بحد ذاته: دمج قلادات بأطوال مختلفة، 
                أو تكديس خواتم بأحجام متفاوتة، يخلق إطلالة ديناميكية تعكس شخصيتكِ الفريدة. 
                والأهم: اختاري القطع التي تشعركِ بالثقة والراحة - لأن الأناقة الحقيقية تبدأ من الداخل.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
