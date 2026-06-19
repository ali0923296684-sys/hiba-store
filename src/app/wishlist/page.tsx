"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingCart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart(item);
    setIsCartOpen(true);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach((item) => addToCart(item));
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream pt-32 pb-20">
      <div className="section-padding max-w-[1200px] mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 border border-red-500/20"
          >
            <Heart className="w-9 h-9 text-red-400 fill-red-400" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold mb-4"
          >
            قائمة <span className="gold-gradient-text">أمنياتكِ</span>
          </motion.h1>
          <p className="text-luxury-cream/40">
            {wishlist.length > 0
              ? `لديكِ ${wishlist.length} منتج في المفضلة`
              : "لم تضيفي أي منتج للمفضلة بعد"}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="w-32 h-32 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto mb-8">
              <Heart className="w-16 h-16 text-white/10" />
            </div>
            <p className="text-white/30 text-lg mb-2">المفضلة فارغة</p>
            <p className="text-white/15 text-sm mb-8">اضغطي على ❤️ بجانب أي منتج لإضافته هنا</p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
              <ShoppingBag size={18} />
              تصفحي المنتجات
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <Link href="/shop" className="text-luxury-beige/60 hover:text-luxury-beige text-sm flex items-center gap-1">
                <ArrowRight size={14} />
                متابعة التسوق
              </Link>
              <button onClick={handleAddAllToCart} className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold">
                <ShoppingCart size={16} />
                إضافة الكل للسلة ({wishlist.length})
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence>
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className="glass-card overflow-hidden group"
                  >
                    <div className="relative aspect-square overflow-hidden bg-dark-800">
                      <Link href={`/product/${item.id}`}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent pointer-events-none" />
                      <button onClick={() => removeFromWishlist(item.id)} className="absolute top-3 left-3 w-9 h-9 rounded-full bg-red-500/20 backdrop-blur-sm flex items-center justify-center text-red-400 hover:bg-red-500/40 transition-all hover:scale-110 z-10">
                        <Trash2 size={16} />
                      </button>
                      <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-dark-900/50 backdrop-blur-sm flex items-center justify-center z-10">
                        <Heart size={16} className="text-red-400 fill-red-400" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={() => handleAddToCart(item)} className="w-full py-2.5 rounded-xl bg-luxury-beige text-dark-900 text-xs font-bold flex items-center justify-center gap-2 hover:bg-luxury-gold transition-colors">
                          <ShoppingCart size={14} />
                          أضيفي للسلة
                        </button>
                      </div>
                    </div>
                    <div className="p-3 md:p-4">
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-bold text-sm line-clamp-1 mb-1 group-hover:text-luxury-beige transition-colors">{item.name}</h3>
                      </Link>
                      {item.category && <p className="text-[10px] text-white/30 mb-2">{item.category}</p>}
                      <p className="font-serif text-lg font-bold gold-gradient-text">{formatPrice(item.price)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}