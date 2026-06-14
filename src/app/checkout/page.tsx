"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Check, Lock, 
  Minus, Plus, Trash2, Loader2, MessageCircle, PackageCheck
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { supabase } from "@/lib/supabase"; 
import Link from "next/link";

type CheckoutStep = "cart" | "shipping" | "confirmation";

function getCartItemKey(item: { id: number; selectedColor?: string; selectedSize?: string }): string {
  return `${item.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}`;
}

// 🚚 إعدادات التوصيل
const freeShippingCities = ["صرمان", "صبراتة"]; // المدن المجانية
const DELIVERY_FEE = 25; // رسوم باقي المدن

const libyanCities = [
  "طرابلس", "سوق الجمعة", "عين زارة", "أبو سليم", "حي الأندلس", "تاجوراء", "جنزور", "السواني بن آدم", "قصر بن غشير", 
  "الزاوية", "صبراتة", "صرمان", "العجيلات", "الجميل", "زوارة", "الخمس", "زليتن", "مصراتة", "بني وليد", "ترهونة", "غريان", 
  "بنغازي", "المرج", "البيضاء", "شحات", "درنة", "طبرق", "أجدابيا", "سرت", "سبها", "الكفرة", "أوباري", "غات"
].sort();

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" });
  const [isCheckingPromo, setIsCheckingPromo] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "", phone: "", address: "", city: "طرابلس",
  });
  const [orderNumber, setOrderNumber] = useState("");

  // 🧮 حساب الأسعار (مع التوصيل)
  const priceAfterDiscount = totalPrice - (totalPrice * discountPercent) / 100;
  const shippingCost = freeShippingCities.includes(formData.city) ? 0 : DELIVERY_FEE;
  const finalPrice = priceAfterDiscount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsCheckingPromo(true);
    setPromoMessage({ text: "", type: "" });
    try {
      const { data } = await supabase.from('promo_codes').select('*').eq('code', promoCode.toUpperCase()).single();
      if (data && data.is_active) {
        setDiscountPercent(data.discount_percentage);
        setPromoMessage({ text: `✨ تم تفعيل خصم ${data.discount_percentage}%`, type: "success" });
      } else {
        setDiscountPercent(0);
        setPromoMessage({ text: "كود الخصم غير صحيح", type: "error" });
      }
    } catch (err) {
      setDiscountPercent(0);
      setPromoMessage({ text: "كود الخصم غير صحيح", type: "error" });
    } finally {
      setIsCheckingPromo(false);
    }
  };

  const handleCompleteOrder = async () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("يرجى تعبئة الاسم ورقم الهاتف والعنوان");
      return;
    }

    setIsSubmitting(true);
    const newOrderNum = Math.random().toString(36).substr(2, 9).toUpperCase();
    const orderID = `#${newOrderNum}`;

    try {
      const { error } = await supabase.from('orders').insert([{
        order_number: orderID,
        customer_name: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        total_amount: finalPrice,
        total_price: finalPrice,
        notes: `التوصيل: ${shippingCost === 0 ? 'مجاني' : shippingCost + ' د.ل'} ${discountPercent > 0 ? `| خصم: ${promoCode}` : ""}`,
        items: items, 
        status: 'جاري التجهيز'
      }]);
      if (error) throw error;

      const detailedItemsList = items.map((item) => {
        let line = `- ${item.name} (الكمية: ${item.quantity})`;
        if (item.selectedColor) line += ` - اللون: ${item.selectedColor}`;
        if (item.selectedSize) line += ` - المقاس: ${item.selectedSize}`;
        return line;
      }).join("%0A");

      // إرسال تلجرام
      const botToken = "8221648331:AAHQQT-1nEGbTHksAyAK5BVU4r8mqX61JOk";
      const chatId = "8459612624";
      const telegramItems = items.map((item) => `- ${item.name} (${item.quantity})${item.selectedColor ? ` - ${item.selectedColor}` : ''}`).join("\n");
      const telegramMessage = `🏛️ طلب جديد\n\nالاسم: ${formData.fullName}\nالهاتف: ${formData.phone}\nالمكان: ${formData.city} - ${formData.address}\n\nالطلبات:\n${telegramItems}\n\nالتوصيل: ${shippingCost === 0 ? 'مجاني' : shippingCost + ' د.ل'}\nالإجمالي: ${finalPrice} د.ل`;
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: telegramMessage }),
      });

      // فتح واتساب
      const whatsappMessage = 
        `🏛️ طلب جديد%0A%0A` +
        `الاسم: ${formData.fullName}%0A` +
        `الهاتف: ${formData.phone}%0A` +
        `المكان: ${formData.city} - ${formData.address}%0A%0A` +
        `الطلبات:%0A${detailedItemsList}%0A%0A` +
        `التوصيل: ${shippingCost === 0 ? "مجاني" : formatPrice(shippingCost)}%0A` +
        `الإجمالي: ${formatPrice(finalPrice)}`;
      window.open(`https://wa.me/218935364926?text=${whatsappMessage}`, "_blank");

      setOrderNumber(newOrderNum);
      setStep("confirmation");
      clearCart();

    } catch (error: any) {
      alert("خطأ: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center section-padding">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 max-w-lg w-full text-center border-luxury-beige/20">
          <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8"><PackageCheck className="text-green-500" size={48} /></div>
          <h1 className="font-serif text-3xl font-bold gold-gradient-text mb-4">تم استلام طلبكِ بنجاح!</h1>
          <p className="text-luxury-cream/60 mb-8 leading-relaxed">شكراً لثقتكِ بمتجر هبة الرحمن. سنتواصل معكِ لتأكيد التوصيل.</p>
          <div className="bg-dark-800 p-6 rounded-2xl mb-8 border border-white/5">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">رقم الطلب</p>
            <p className="font-mono text-3xl font-bold text-luxury-beige">#{orderNumber}</p>
          </div>
          <Link href="/" className="btn-primary block w-full py-4 text-center">العودة للرئيسية</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-luxury-cream pt-24 md:pt-28 pb-20">
      <div className="section-padding max-w-[1200px] mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8 md:mb-12 italic text-right">إتمام <span className="gold-gradient-text">الشراء</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {step === "cart" && (
                <div className="space-y-4">
                  {items.length === 0 ? (
                     <div className="glass-card p-12 text-center"><p className="text-luxury-cream/40 text-lg mb-4">الحقيبة فارغة</p><Link href="/" className="btn-primary inline-block">تصفحي المنتجات</Link></div>
                  ) : (
                    <>
                      {items.map((item) => {
                        const itemKey = getCartItemKey(item);
                        return (
                          <div key={itemKey} className="glass-card p-4 md:p-6 flex gap-4 md:gap-6 border-white/5">
                            <img src={item.image} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-sm md:text-base">{item.name}</h3>
                                <button onClick={() => removeFromCart(itemKey)} className="text-red-400/30 hover:text-red-400"><Trash2 size={18}/></button>
                              </div>
                              <div className="text-xs text-luxury-cream/40 mb-3">
                                {item.selectedColor && <span className="ml-2">اللون: <span className="text-luxury-beige">{item.selectedColor}</span></span>}
                                {item.selectedSize && <span>المقاس: <span className="text-luxury-beige">{item.selectedSize}</span></span>}
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3 bg-dark-800 rounded-lg p-1">
                                    <button onClick={() => updateQuantity(itemKey, item.quantity - 1)} className="p-1 hover:text-luxury-beige"><Minus size={14}/></button>
                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(itemKey, item.quantity + 1)} className="p-1 hover:text-luxury-beige"><Plus size={14}/></button>
                                </div>
                                <p className="font-bold text-luxury-beige text-sm md:text-base">{formatPrice(item.price * item.quantity)}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <button onClick={() => setStep("shipping")} className="btn-primary w-full py-4 md:py-5 text-base md:text-lg mt-6">المتابعة لبيانات التوصيل</button>
                    </>
                  )}
                </div>
              )}

              {step === "shipping" && (
                <div className="glass-card p-6 md:p-8 border-white/5 space-y-6 text-right">
                  <h2 className="text-xl md:text-2xl font-serif mb-6">معلومات الاستلام</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase opacity-40">الاسم الكامل *</label>
                        <input type="text" name="fullName" required className="text-right w-full bg-dark-800 p-4 rounded-xl border border-white/5 focus:border-luxury-beige/40 outline-none" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase opacity-40">رقم الهاتف *</label>
                        <input type="tel" name="phone" required className="text-right w-full bg-dark-800 p-4 rounded-xl border border-white/5 focus:border-luxury-beige/40 outline-none" onChange={handleInputChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase opacity-40">المدينة *</label>
                        <select name="city" value={formData.city} className="text-right w-full bg-dark-800 p-4 rounded-xl border border-white/5 outline-none" onChange={handleInputChange}>
                            {libyanCities.map(city => (
                              <option key={city} value={city}>
                                {city} {freeShippingCities.includes(city) ? "(توصيل مجاني 🎉)" : `(توصيل ${DELIVERY_FEE} د.ل)`}
                              </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase opacity-40">العنوان التفصيلي *</label>
                        <input type="text" name="address" required className="text-right w-full bg-dark-800 p-4 rounded-xl border border-white/5 focus:border-luxury-beige/40 outline-none" onChange={handleInputChange} />
                    </div>
                  </div>

                  {/* 🚚 تنبيه التوصيل */}
                  <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${shippingCost === 0 ? 'bg-green-500/10 text-green-400' : 'bg-luxury-beige/10 text-luxury-beige'}`}>
                    <Truck className="w-5 h-5" />
                    {shippingCost === 0 ? `🎉 رائع! التوصيل مجاني إلى ${formData.city}` : `رسوم التوصيل إلى ${formData.city} هي ${DELIVERY_FEE} د.ل`}
                  </div>

                  <button onClick={handleCompleteOrder} disabled={isSubmitting} className="btn-primary w-full py-4 md:py-5 text-lg md:text-xl flex items-center justify-center gap-3 !bg-green-600 hover:!bg-green-700 !text-white">
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><MessageCircle /> تأكيد وإرسال الطلب</>}
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* ملخص الطلب مع تفاصيل التوصيل */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 md:p-8 lg:sticky lg:top-28 border-luxury-beige/10">
              <h3 className="font-serif text-lg md:text-xl mb-6 text-right">ملخص الحقيبة</h3>
              
              <div className="py-4 border-t border-white/5">
                <label className="text-xs opacity-40 mb-2 block text-right">لديكِ كود خصم؟</label>
                <div className="flex gap-2">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 bg-dark-800 border border-white/5 rounded-lg px-3 py-2 outline-none focus:border-luxury-beige text-sm text-right" placeholder="أدخلي الكود" />
                  <button onClick={handleApplyPromo} disabled={isCheckingPromo} className="px-4 py-2 bg-luxury-beige text-dark-900 rounded-lg text-xs font-bold">{isCheckingPromo ? "..." : "تطبيق"}</button>
                </div>
                {promoMessage.text && <p className={`text-[10px] mt-2 text-right ${promoMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{promoMessage.text}</p>}
              </div>

              {/* 🧮 تفاصيل الحساب */}
              <div className="border-t border-white/5 pt-4 space-y-3 text-sm">
                <div className="flex justify-between opacity-60">
                  <span>{formatPrice(totalPrice)}</span>
                  <span>المنتجات</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>- {formatPrice(totalPrice * discountPercent / 100)}</span>
                    <span>الخصم ({discountPercent}%)</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className={shippingCost === 0 ? "text-green-400 font-bold" : "opacity-60"}>{shippingCost === 0 ? "مجاني 🎉" : formatPrice(shippingCost)}</span>
                  <span className="opacity-60">التوصيل</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-2">
                  <span className="text-2xl md:text-3xl font-serif gold-gradient-text">{formatPrice(finalPrice)}</span>
                  <span className="font-bold text-lg">الإجمالي</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}