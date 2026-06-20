"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Check, ChevronLeft,
  Truck, Shield, RotateCcw, Play,
  Loader2, Video, AlertCircle, ShoppingBag
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Product } from "@/types";
import ViewersCount from "@/components/ViewersCount";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', url: '', index: 0 });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showColorError, setShowColorError] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    async function getProductData() {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const { data: mainProduct, error } = await supabase
          .from('products').select('*').eq('id', params.id).single();
        if (error) throw error;
        if (mainProduct) {
          setProduct(mainProduct);
          setSelectedMedia({ type: 'image', url: mainProduct.image, index: 0 });
          const { data: related } = await supabase
            .from('products').select('*').eq('category', mainProduct.category).neq('id', mainProduct.id).limit(4);
          if (related) setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    getProductData();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setShowColorError(true);
      setTimeout(() => setShowColorError(false), 2000);
      return;
    }
    addToCart({ ...product, selectedColor, selectedSize });
    setAddedToCart(true);
    setTimeout(() => { setAddedToCart(false); setIsCartOpen(true); }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
        <p className="text-luxury-cream/40 font-serif">جاري جلب تفاصيل القطعة الفاخرة...</p>
      </div>
    );
  }

  if (!product) return <div className="text-center py-40 text-luxury-cream">المنتج غير موجود</div>;

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream">
      <div className="pt-24 md:pt-28 pb-20 section-padding max-w-[1500px] mx-auto">

        <div className="flex items-center gap-2 text-xs md:text-sm text-luxury-cream/40 mb-6">
          <Link href="/" className="hover:text-luxury-beige">الرئيسية</Link>
          <ChevronLeft className="w-3 h-3" />
          <span className="text-luxury-beige line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          <div className="space-y-3 md:space-y-4">
            <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden glass-card bg-dark-900">
              <AnimatePresence mode="wait">
                {selectedMedia.type === 'video' ? (
                  <motion.video key={selectedMedia.url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} src={selectedMedia.url} controls autoPlay playsInline className="w-full h-full object-contain bg-black" />
                ) : (
                  <motion.img key={selectedMedia.url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} src={selectedMedia.url} className="w-full h-full object-cover" />
                )}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {allImages.map((img, i) => (
                <button key={`img-${i}`} onClick={() => setSelectedMedia({ type: 'image', url: img, index: i })} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedMedia.url === img ? "border-luxury-beige" : "border-transparent opacity-50"}`}>
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
              {product.videos?.map((vid, i) => (
                <button key={`vid-${i}`} onClick={() => setSelectedMedia({ type: 'video', url: vid, index: i })} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-dark-800 flex items-center justify-center relative ${selectedMedia.url === vid ? "border-luxury-beige" : "border-transparent opacity-50"}`}>
                  <Video className="w-6 h-6 text-luxury-beige/50" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play className="w-5 h-5 text-white fill-white" /></div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <span className="text-luxury-beige text-xs md:text-sm tracking-widest uppercase">{product.category}</span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight">{product.name}</h1>

            <div className="flex items-baseline gap-4">
              <span className="font-serif text-3xl md:text-4xl font-bold gold-gradient-text">{formatPrice(product.price)}</span>
            </div>

            <p className="text-luxury-cream/60 leading-relaxed text-sm md:text-lg">{product.description}</p>

            {/* 👁️ يشاهده X شخص */}
            <ViewersCount />

            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 py-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-luxury-cream">
                    اللون: <span className="text-luxury-beige font-bold">{selectedColor || "اختاري اللون"}</span>
                  </p>
                  <AnimatePresence>
                    {showColorError && (
                      <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-red-400 text-xs flex items-center gap-1">
                        <AlertCircle size={12} /> يرجى اختيار اللون
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map(c => (
                    <button key={c} onClick={() => { setSelectedColor(c); setShowColorError(false); }} className={`px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all duration-300 ${selectedColor === c ? 'border-luxury-beige bg-luxury-beige text-dark-900 scale-105' : `border-white/10 hover:border-luxury-beige/50 text-luxury-cream/80 ${showColorError ? 'border-red-500/50 animate-pulse' : ''}`}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 py-2">
                <p className="text-sm font-medium text-luxury-cream">المقاس: <span className="text-luxury-beige font-bold">{selectedSize || "اختاري المقاس"}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSelectedSize(s)} className={`min-w-[48px] px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize === s ? 'border-luxury-beige bg-luxury-beige text-dark-900' : 'border-white/10 hover:border-luxury-beige/50'}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <button onClick={handleAddToCart} disabled={addedToCart} className={`w-full py-4 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${addedToCart ? "bg-green-600" : "bg-luxury-beige text-dark-900 hover:bg-luxury-gold"}`}>
                {addedToCart ? <Check size={22} /> : <ShoppingCart size={22} />}
                {addedToCart ? "تمت الإضافة بنجاح" : "أضيفي للحقيبة الآن"}
              </button>
              <Link href="/checkout" className="block">
                <button className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all border-2 border-luxury-beige/40 text-luxury-beige hover:bg-luxury-beige/10 active:scale-95">
                  <ShoppingBag size={20} />
                  الذهاب للحقيبة وإتمام الشراء
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
              <div className="text-center"><Truck className="mx-auto mb-2 text-luxury-beige/60" size={20} /><span className="text-[9px] md:text-[10px] uppercase opacity-40">توصيل سريع</span></div>
              <div className="text-center"><Shield className="mx-auto mb-2 text-luxury-beige/60" size={20} /><span className="text-[9px] md:text-[10px] uppercase opacity-40">أصلي 100%</span></div>
              <div className="text-center"><RotateCcw className="mx-auto mb-2 text-luxury-beige/60" size={20} /><span className="text-[9px] md:text-[10px] uppercase opacity-40">إرجاع سهل</span></div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="bg-white/[0.02] py-16 md:py-20 border-t border-white/5">
          <div className="section-padding max-w-[1500px] mx-auto">
            <h3 className="font-serif text-2xl md:text-3xl mb-8 md:mb-12 text-center">أكملي <span className="gold-gradient-text">أناقتكِ</span></h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {relatedProducts.map(item => (
                <Link key={item.id} href={`/product/${item.id}`} className="glass-card-hover p-3 md:p-4 block group">
                  <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-dark-800">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-semibold text-xs md:text-sm mb-1 line-clamp-1">{item.name}</h4>
                  <p className="gold-gradient-text font-bold text-sm md:text-base">{formatPrice(item.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}