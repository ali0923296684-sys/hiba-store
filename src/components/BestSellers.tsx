"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Star, ShoppingCart, Crown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("rating", { ascending: false })
        .limit(8);
      if (data) setProducts(data);
    }
    fetch();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-white/[0.01]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-red-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs mb-4">
            <TrendingUp className="w-4 h-4" />
            الأكثر مبيعاً
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            منتجات <span className="gold-gradient-text">الزبائن تحبها</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
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

                    {/* ترتيب المبيعات */}
                    {i < 3 && (
                      <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">#{i + 1}</span>
                      </div>
                    )}

                    {/* ملصق الأكثر مبيعاً */}
                    {i === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[8px] font-bold rounded-full flex items-center gap-1">
                        <Crown size={8} />
                        الأكثر مبيعاً
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs md:text-sm font-bold truncate mb-1 group-hover:text-luxury-beige transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-serif font-bold gold-gradient-text">
                        {formatPrice(product.price)}
                      </p>
                      <div className="flex items-center gap-0.5 text-luxury-gold">
                        <Star size={10} className="fill-current" />
                        <span className="text-[9px] font-bold">{product.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-sm">
            <ShoppingCart size={16} />
            شوفي كل المنتجات
          </Link>
        </div>
      </div>
    </section>
  );
}