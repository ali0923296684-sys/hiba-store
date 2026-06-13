"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, Gem, Watch, Footprints, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// التصميم الأساسي للأقسام (الأيقونات والأسماء)
const categoryConfig = [
  { id: "عطور فاخرة", name: "عطور فاخرة", icon: Sparkles },
  { id: "حقائب يد", name: "حقائب يد", icon: ShoppingBag },
  { id: "إكسسوارات", name: "إكسسوارات", icon: Gem },
  { id: "ساعات فاخرة", name: "ساعات فاخرة", icon: Watch },
  { id: "أحذية فاخرة", name: "أحذية فاخرة", icon: Footprints },
  { id: "مجوهرات", name: "مجوهرات", icon: Crown },
];

export default function Categories() {
  // حالة (State) لتخزين عدد المنتجات الحقيقي لكل قسم
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchProductCounts() {
      try {
        // جلب أسماء الأقسام فقط من كل المنتجات في قاعدة البيانات لتسريع العملية
        const { data, error } = await supabase.from('products').select('category');
        
        if (error) throw error;

        if (data) {
          // حساب كم مرة تكرر كل قسم
          const counts: Record<string, number> = {};
          data.forEach((item) => {
            counts[item.category] = (counts[item.category] || 0) + 1;
          });
          
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    }

    fetchProductCounts();
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-[#050505] border-t border-white/5">
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      
      <div className="relative z-10 max-w-[1500px] mx-auto section-padding">
        
        {/* العناوين العلوية */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-luxury-cream mb-6"
          >
            اكتشفي عالمي
          </motion.h2>
          <p className="text-luxury-cream/60 text-lg">
            كل فئة مصممة لتلبي ذوقكِ الرفيع وتمنحكِ تجربة تسوق لا تُنسى
          </p>
        </div>

        {/* شبكة الأقسام */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categoryConfig.map((cat, i) => {
            const Icon = cat.icon;
            // جلب العدد الحقيقي، وإذا لم يوجد منتجات نضع 0
            const realCount = categoryCounts[cat.id] || 0;

            return (
              <Link key={cat.id} href={`/#products`}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                  className="glass-card-hover p-6 rounded-3xl flex flex-col items-center text-center group cursor-pointer border border-white/10 hover:border-luxury-beige/40 transition-colors h-full"
                >
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-luxury-beige/10 transition-colors">
                    <Icon className="w-8 h-8 text-luxury-beige/70 group-hover:text-luxury-beige transition-colors" />
                  </div>
                  
                  <h3 className="font-bold text-luxury-cream mb-2 group-hover:text-luxury-beige transition-colors">
                    {cat.name}
                  </h3>
                  
                  <p className="text-sm font-medium text-luxury-cream/40 group-hover:text-luxury-cream/70 transition-colors mt-auto">
                    {realCount} منتج
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}