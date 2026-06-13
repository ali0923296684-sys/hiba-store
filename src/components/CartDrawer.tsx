"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, Package, Check, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

// دالة مساعدة لتوليد مفتاح فريد (مطابق لما في CartContext)
function getCartItemKey(item: { id: number; selectedColor?: string; selectedSize?: string }): string {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`;
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* الخلفية المظلمة */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* درج السلة الجانبي */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 35, stiffness: 350 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-[101] flex flex-col shadow-2xl"
            style={{
              background: "rgba(10, 10, 10, 0.98)",
              borderLeft: "1px solid rgba(201, 169, 110, 0.1)",
            }}
          >
            {/* رأس السلة */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-luxury-beige/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-luxury-beige" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-luxury-cream">حقيبة التسوق</h2>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-beige/50">
                    {totalItems} {totalItems === 1 ? "قطعة" : "قطع"}
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-white/40"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* محتوى المنتجات */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                    <Package className="w-8 h-8 text-white/20" />
                  </div>
                  <p className="text-luxury-cream/40 font-serif">حقيبتكِ فارغة حالياً</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-luxury-beige text-sm hover:underline"
                  >
                    اكتشفي تشكيلتنا الفاخرة
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const itemKey = getCartItemKey(item);
                    return (
                      <motion.div
                        layout
                        key={itemKey}
                        className="flex gap-4 p-2 group relative"
                      >
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="font-bold text-luxury-cream text-sm truncate mb-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-white/30 uppercase tracking-tighter mb-3">
                            {item.selectedColor} {item.selectedSize ? `| ${item.selectedSize}` : ''}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 bg-dark-800 rounded-lg p-1 border border-white/5">
                              <button
                                onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-luxury-beige"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold text-luxury-cream w-4 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-luxury-beige"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-serif font-bold text-luxury-beige">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => removeFromCart(itemKey)}
                          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ملخص الفاتورة والذهاب للطلب */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-6 bg-dark-900/50">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 uppercase tracking-widest text-[10px]">المجموع الفرعي</span>
                    <span className="text-white/60">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40 uppercase tracking-widest text-[10px]">التوصيل</span>
                    <span className="text-green-500 text-[10px] font-bold">مجاني</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="font-serif text-lg text-luxury-cream">الإجمالي النهائي</span>
                    <span className="font-serif text-3xl font-bold gold-gradient-text">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout" 
                    onClick={() => setIsCartOpen(false)}
                    className="block"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-5 rounded-2xl bg-luxury-beige text-dark-900 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-luxury-gold shadow-xl shadow-luxury-beige/10 transition-all"
                    >
                      المتابعة لإتمام الطلب
                      <ArrowLeft size={16} />
                    </motion.button>
                  </Link>
                  
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-3 text-[10px] uppercase tracking-widest text-white/20 hover:text-white/60 transition-colors"
                  >
                    مواصلة التسوق
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}