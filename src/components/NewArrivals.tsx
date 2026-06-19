"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Star, ShoppingCart, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (data) setProducts(data);
    }
    fetch();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-4">
            <Sparkles className="w-4 h-4" />
            وصل حديثاً
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            أحدث <span className="gold-gradient-text">الوصولات</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/product/${product.id}`} className="group block">
                <div className="glass-card overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-dark-800">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent pointer-events-none" />

                    {/* ملصق جديد */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1">
                      <Clock size={8} />
                      جديد
                    </div>
                  </div>

                  <div className="p-2.5">
                    <h4 className="text-xs font-bold truncate mb-1 group-hover:text-luxury-beige transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-sm font-serif font-bold gold-gradient-text">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}