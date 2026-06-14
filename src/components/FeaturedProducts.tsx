"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Zap, Eye, Loader2, Palette } from "lucide-react"; // أضفنا Eye و Palette
import { useRouter } from "next/navigation"; // لاستخدام التوجيه الذكي
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }, [isMobile, x, y]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  }, [isMobile, x, y]);

  if (isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className={className}>
      {children}
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const router = useRouter(); // للتوجيه
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (data) setDbProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const categories = ["الكل", ...new Set(dbProducts.map((p) => p.category))];
  const filtered = selectedCategory === "الكل" ? dbProducts : dbProducts.filter((p) => p.category === selectedCategory);

  // 🛑 الدالة الذكية: تتحقق من وجود ألوان قبل الإضافة
  const handleAddToCart = (product: Product) => {
    // إذا كان المنتج يحتوي على ألوان أو مقاسات، وجّهي الزبون لصفحة المنتج للاختيار
    if ((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) {
      router.push(`/product/${product.id}`);
      return;
    }

    // إذا لم يكن له ألوان، أضيفيه مباشرة
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      setIsCartOpen(true); // فتح السلة بعد الإضافة
    }, 1500);
  };

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="products" className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-luxury-gold/[0.02] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="text-center mb-10 md:mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/5 border border-luxury-beige/10 text-luxury-beige text-xs md:text-sm mb-4 md:mb-6">
            <Zap className="w-4 h-4" /> المجموعة المختارة
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-4 md:mb-6 leading-tight">
            منتجاتنا <span className="gold-gradient-text text-shadow-gold">الفاخرة</span>
          </h2>
          <p className="text-luxury-cream/40 text-sm md:text-lg max-w-xl mx-auto leading-relaxed px-2">
            اختاري من بين أرقى المنتجات المصنوعة بعناية فائقة لتكملي أناقتك
          </p>
        </motion.div>

        {!loading && (
          <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-8 md:mb-16 overflow-x-auto pb-3 custom-scrollbar px-1">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`relative px-5 py-2 md:px-7 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all duration-500 whitespace-nowrap shrink-0 ${selectedCategory === cat ? "bg-luxury-beige text-dark-900 shadow-lg shadow-luxury-beige/30" : "bg-dark-800/50 text-luxury-cream/50 border border-luxury-beige/10"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
              <p className="text-luxury-cream/40 font-serif">جاري تحميل التشكيلة الفاخرة...</p>
            </motion.div>
          ) : (
            <motion.div key={selectedCategory} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5 }} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
              {filtered.map((product, i) => (
                <TiltCard key={product.id}>
                  <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.05 }} onMouseEnter={() => setHoveredProduct(product.id)} onMouseLeave={() => setHoveredProduct(null)} className="group glass-card-hover overflow-hidden h-full" style={{ transformStyle: "preserve-3d" }}>
                    <div className="relative aspect-square overflow-hidden bg-dark-800">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" priority={i < 4} className={`object-cover cursor-pointer transition-transform duration-700 ${hoveredProduct === product.id ? "scale-110 brightness-110" : "scale-100"}`} />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-60 pointer-events-none" />

                      {product.badge && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 px-2 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-luxury-gold to-luxury-beige text-dark-900 text-[8px] md:text-xs font-bold rounded-full shadow-lg">
                          {product.badge}
                        </div>
                      )}

                      {/* مؤشر الألوان */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="absolute bottom-2 left-2 z-10 bg-dark-900/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Palette className="w-3 h-3 text-luxury-beige" />
                          <span className="text-[8px] text-luxury-cream/80">{product.colors.length} ألوان</span>
                        </div>
                      )}

                      <button onClick={() => toggleLike(product.id)} className="absolute top-2 left-2 md:top-4 md:left-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${likedIds.has(product.id) ? "text-red-400 fill-red-400" : "text-luxury-cream/60"}`} />
                      </button>

                      {/* أزرار الإضافة */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-5 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex gap-1.5 md:gap-2">
                          <button onClick={() => handleAddToCart(product)} className={`flex-1 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 md:gap-2 transition-all shadow-lg ${addedIds.has(product.id) ? "bg-green-500 text-white" : "bg-luxury-beige text-dark-900"}`}>
                            {addedIds.has(product.id) ? <Check className="w-3 h-3 md:w-4 md:h-4" /> : <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />}
                            {/* النص يتغير حسب وجود الألوان */}
                            <span>
                              {addedIds.has(product.id) 
                                ? "تمت" 
                                : (product.colors && product.colors.length > 0 ? "اختاري اللون" : "إضافة")}
                            </span>
                          </button>
                          <Link href={`/product/${product.id}`}>
                            <button className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-dark-900/70 backdrop-blur-sm flex items-center justify-center text-luxury-cream">
                              <Eye className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="p-3 md:p-6">
                      <div className="flex items-start justify-between mb-2">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-luxury-cream text-sm md:text-lg line-clamp-1 leading-tight">{product.name}</h3>
                        </Link>
                        <div className="flex items-center gap-1 text-luxury-gold shrink-0">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-[10px] md:text-xs font-bold">{product.rating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] md:text-sm text-luxury-cream/30 mb-3 line-clamp-1 md:line-clamp-2 leading-relaxed">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-lg md:text-2xl font-bold gold-gradient-text-static">{formatPrice(product.price)}</span>
                        {product.originalPrice && (<span className="text-xs text-luxury-cream/20 line-through">{formatPrice(product.originalPrice)}</span>)}
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}