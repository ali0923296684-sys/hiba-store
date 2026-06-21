"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Search, Loader2, Palette, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

export default function ShopPage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

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

  const filtered = dbProducts.filter((p) => {
    const matchesCategory = selectedCategory === "الكل" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    if ((product.colors && product.colors.length > 0) || (product.sizes && product.sizes.length > 0)) {
      router.push(`/product/${product.id}`);
      return;
    }
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream pt-24 md:pt-32 pb-20">
      <div className="section-padding max-w-[1500px] mx-auto">

        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">
            تسوقي <span className="gold-gradient-text">مجموعتنا</span>
          </h1>
          <p className="text-luxury-cream/40 text-sm md:text-lg">اكتشفي كل القطع الفاخرة المتوفرة لدينا في مكان واحد</p>
        </div>

        <div className="max-w-xl mx-auto mb-8 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-beige/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحثي عن منتج..."
            className="w-full bg-dark-800 border border-luxury-beige/10 rounded-2xl py-4 pr-12 pl-4 text-right outline-none focus:border-luxury-beige/40 transition-colors"
          />
        </div>

        {!loading && (
          <div className="flex justify-start md:justify-center gap-2 md:gap-3 mb-10 overflow-x-auto pb-3 custom-scrollbar px-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 md:px-7 md:py-3 rounded-full text-xs md:text-sm font-medium whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory === cat ? "bg-luxury-beige text-dark-900 shadow-lg" : "bg-dark-800/50 text-luxury-cream/50 border border-luxury-beige/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
            <p className="text-luxury-cream/40 font-serif">جاري تحميل التشكيلة...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <p className="text-luxury-cream/40 text-lg">لا توجد منتجات تطابق بحثكِ 😔</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            <AnimatePresence>
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group glass-card-hover overflow-hidden h-full"
                >
                  <div className="relative aspect-square overflow-hidden bg-dark-800">
                    <Link href={`/product/${product.id}`} className="relative block w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={i < 4}
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent opacity-60 pointer-events-none" />

                    {product.badge && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-luxury-gold to-luxury-beige text-dark-900 text-[8px] md:text-xs font-bold rounded-full">
                        {product.badge}
                      </div>
                    )}

                    <button
                      onClick={() => toggleWishlist({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        rating: product.rating,
                      })}
                      className="absolute top-2 left-2 md:top-3 md:left-3 w-8 h-8 md:w-9 md:h-9 rounded-full 
                                 bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-10 
                                 transition-all hover:scale-110 active:scale-90"
                    >
                      <Heart
                        className={`w-4 h-4 transition-all duration-300 ${
                          isInWishlist(product.id)
                            ? "text-red-400 fill-red-400 scale-110"
                            : "text-white/40 hover:text-red-300"
                        }`}
                      />
                    </button>

                    {product.colors && product.colors.length > 0 && (
                      <div className="absolute bottom-2 left-2 z-10 bg-dark-900/60 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Palette className="w-3 h-3 text-luxury-beige" />
                        <span className="text-[8px] text-luxury-cream/80">{product.colors.length}</span>
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold flex items-center justify-center gap-1 bg-luxury-beige text-dark-900"
                      >
                        <ShoppingCart className="w-3 h-3 md:w-4 md:h-4" />
                        {product.colors && product.colors.length > 0 ? "اختاري اللون" : "إضافة"}
                      </button>
                    </div>
                  </div>

                  <div className="p-3 md:p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold text-luxury-cream text-sm md:text-base line-clamp-1 leading-tight group-hover:text-luxury-beige">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 text-luxury-gold shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold">{product.rating}</span>
                      </div>
                    </div>
                    <p className="font-serif text-base md:text-xl font-bold gold-gradient-text-static mt-2">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}