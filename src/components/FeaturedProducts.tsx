"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShoppingCart, Star, Heart, Check, Zap, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; // استيراد مكوّن Image من Next.js لتحسين السرعة
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // الكشف عن نوع الجهاز لتخفيف الحركات على الهواتف
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
    if (isMobile || !ref.current) return; // لا تقم بالتأثير في الجوال
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
    return <div className={className}>{children}</div>; // إرجاع مكون عادي للجوال
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

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
  
  const filtered = selectedCategory === "الكل" 
    ? dbProducts 
    : dbProducts.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 2000);
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
    <section id="products" className="py-32 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-luxury-gold/[0.02] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-noise opacity-40" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
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
            <Zap className="w-4 h-4" />
            المجموعة المختارة
          </motion.span>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
            منتجاتنا{" "}
            <span className="gold-gradient-text text-shadow-gold">الفاخرة</span>
          </h2>
          <p className="text-luxury-cream/40 text-lg max-w-xl mx-auto leading-relaxed">
            اختاري من بين أرقى المنتجات المصنوعة بعناية فائقة لتكملي أناقتك
          </p>
        </motion.div>

        {/* Categories Tabs */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-16"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`relative px-7 py-3 rounded-full text-sm font-medium transition-all duration-500 overflow-hidden ${
                  selectedCategory === cat
                    ? "bg-luxury-beige text-dark-900 shadow-lg shadow-luxury-beige/30"
                    : "bg-dark-800/50 text-luxury-cream/50 hover:text-luxury-cream border border-luxury-beige/10 hover:border-luxury-beige/30"
                }`}
              >
                {selectedCategory === cat && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-luxury-beige rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
              <p className="text-luxury-cream/40 font-serif">جاري تحميل التشكيلة الفاخرة...</p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filtered.map((product, i) => (
                <TiltCard key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    className="group glass-card-hover overflow-hidden"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="relative aspect-square overflow-hidden bg-dark-800">
                      <Link href={`/product/${product.id}`} className="block w-full h-full">
                        {/* استخدام مكون Image للسرعة الصاروخية */}
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          priority={i < 4}
                          className={`object-cover cursor-pointer transition-transform duration-700 ease-[0.4,0,0.2,1] ${hoveredProduct === product.id ? "scale-110 brightness-110" : "scale-100 brightness-100"}`}
                        />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none" />

                      <AnimatePresence>
                        {product.badge && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="absolute top-4 right-4 px-4 py-1.5 bg-gradient-to-r from-luxury-gold to-luxury-beige text-dark-900 text-xs font-bold rounded-full shadow-lg shadow-luxury-gold/20"
                          >
                            {product.badge}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(product.id)}
                        className="absolute top-4 left-4 w-10 h-10 rounded-full bg-dark-900/50 backdrop-blur-sm flex items-center justify-center transition-all z-10"
                      >
                        <Heart className={`w-4 h-4 transition-colors ${likedIds.has(product.id) ? "text-red-400 fill-red-400" : "text-luxury-cream/60 hover:text-red-400"}`} />
                      </motion.button>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredProduct === product.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-5 z-10"
                      >
                        <div className="flex gap-2">
                          <motion.button
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: hoveredProduct === product.id ? 0 : 20, opacity: hoveredProduct === product.id ? 1 : 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAddToCart(product)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                              addedIds.has(product.id)
                                ? "bg-green-500 text-white shadow-green-500/30"
                                : "bg-luxury-beige text-dark-900 hover:bg-luxury-gold shadow-luxury-beige/30"
                            }`}
                          >
                            {addedIds.has(product.id) ? <><Check className="w-4 h-4" />تمت الإضافة</> : <><ShoppingCart className="w-4 h-4" />أضيفي للسلة</>}
                          </motion.button>
                          <Link href={`/product/${product.id}`}>
                            <motion.button
                              initial={{ y: 20, opacity: 0 }}
                              animate={{ y: hoveredProduct === product.id ? 0 : 20, opacity: hoveredProduct === product.id ? 1 : 0 }}
                              transition={{ duration: 0.4, delay: 0.2 }}
                              whileHover={{ scale: 1.05 }}
                              className="w-12 h-12 rounded-xl bg-dark-900/70 backdrop-blur-sm flex items-center justify-center text-luxury-cream hover:text-luxury-beige transition-all"
                            >
                              <Eye className="w-5 h-5" />
                            </motion.button>
                          </Link>
                        </div>
                      </motion.div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-semibold text-luxury-cream group-hover:text-luxury-beige transition-colors duration-300 line-clamp-1 text-lg cursor-pointer">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-luxury-gold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-bold">{product.rating}</span>
                        </div>
                      </div>

                      <p className="text-sm text-luxury-cream/30 mb-4 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-2xl font-bold gold-gradient-text-static">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-luxury-cream/20 line-through">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                        <span className="text-xs text-luxury-cream/25">{product.reviews} تقييم</span>
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