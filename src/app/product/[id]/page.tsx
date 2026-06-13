"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ShoppingCart, Check, ChevronLeft,
  Truck, Shield, RotateCcw, Play, 
  Loader2, Video
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Product } from "@/types";

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedMedia, setSelectedMedia] = useState({ type: 'image', url: '', index: 0 });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    async function getProductData() {
      try {
        setLoading(true);
        const { data: mainProduct, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        if (mainProduct) {
          setProduct(mainProduct);
          setSelectedColor(mainProduct.colors?.[0] || "");
          setSelectedSize(mainProduct.sizes?.[0] || "");
          setSelectedMedia({ type: 'image', url: mainProduct.image, index: 0 });

          const { data: related } = await supabase
            .from('products')
            .select('*')
            .eq('category', mainProduct.category)
            .neq('id', mainProduct.id)
            .limit(4);
          
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
    addToCart({ ...product, selectedColor, selectedSize });
    setAddedToCart(true);
    // نفتح سلة التسوق تلقائياً ليشاهد الزبون المنتج ويذهب للدفع
    setTimeout(() => {
        setAddedToCart(false);
        setIsCartOpen(true);
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mb-4" />
        <p className="text-luxury-cream/40 font-serif">جاري جلب تفاصيل القطعة الفاخرة...</p>
      </div>
    );
  }

  if (!product) return <div className="text-center py-20 text-luxury-cream">المنتج غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream">
      <div className="pt-28 pb-20 section-padding max-w-[1500px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* الجانب الأيسر: المعرض */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card bg-dark-900">
              <AnimatePresence mode="wait">
                {selectedMedia.type === 'video' ? (
                  <motion.video
                    key={selectedMedia.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <motion.img
                    key={selectedMedia.url}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={selectedMedia.url}
                    className="w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images?.map((img, i) => (
                <button 
                  key={`img-${i}`}
                  onClick={() => setSelectedMedia({ type: 'image', url: img, index: i })}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${selectedMedia.url === img ? "border-luxury-beige shadow-lg" : "border-transparent opacity-50"}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
              
              {product.videos?.map((vid, i) => (
                <button 
                  key={`vid-${i}`}
                  onClick={() => setSelectedMedia({ type: 'video', url: vid, index: i })}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-dark-800 flex items-center justify-center relative transition-all ${selectedMedia.url === vid ? "border-luxury-beige shadow-lg" : "border-transparent opacity-50"}`}
                >
                  <Video className="w-6 h-6 text-luxury-beige" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* الجانب الأيمن: المعلومات */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-luxury-beige text-sm tracking-widest uppercase">
              <span className="w-8 h-px bg-luxury-beige/30"></span>
              {product.category}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold italic">{product.name}</h1>
            
            <div className="flex items-baseline gap-4">
              <span className="font-serif text-4xl font-bold gold-gradient-text">{formatPrice(product.price)}</span>
            </div>

            <p className="text-luxury-cream/60 leading-relaxed text-lg">{product.description}</p>

            {/* الألوان والمقاسات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                {product.colors && product.colors.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-widest opacity-40">اللون المختار: {selectedColor}</p>
                        <div className="flex flex-wrap gap-2">
                            {product.colors.map(c => (
                                <button key={c} onClick={() => setSelectedColor(c)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${selectedColor === c ? 'border-luxury-beige bg-luxury-beige text-dark-900 font-bold' : 'border-white/10 hover:border-white/30'}`}>{c}</button>
                            ))}
                        </div>
                    </div>
                )}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-xs uppercase tracking-widest opacity-40">المقاس المختار: {selectedSize}</p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map(s => (
                                <button key={s} onClick={() => setSelectedSize(s)} className={`px-4 py-2 rounded-xl border text-sm transition-all ${selectedSize === s ? 'border-luxury-beige bg-luxury-beige text-dark-900 font-bold' : 'border-white/10 hover:border-white/30'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="pt-6">
              <button 
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${addedToCart ? "bg-green-600 shadow-green-900/20" : "bg-luxury-beige text-dark-900 hover:bg-luxury-gold shadow-luxury-beige/20"}`}
              >
                {addedToCart ? <Check size={24} /> : <ShoppingCart size={24} />}
                {addedToCart ? "تمت الإضافة للحقيبة" : "أضيفي للحقيبة الآن"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-white/5">
                <div className="text-center">
                    <Truck className="mx-auto mb-2 text-luxury-beige/60" size={20} />
                    <span className="text-[10px] uppercase opacity-40 tracking-tighter">توصيل سريع</span>
                </div>
                <div className="text-center">
                    <Shield className="mx-auto mb-2 text-luxury-beige/60" size={20} />
                    <span className="text-[10px] uppercase opacity-40 tracking-tighter">أصلي 100%</span>
                </div>
                <div className="text-center">
                    <RotateCcw className="mx-auto mb-2 text-luxury-beige/60" size={20} />
                    <span className="text-[10px] uppercase opacity-40 tracking-tighter">إرجاع سهل</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}