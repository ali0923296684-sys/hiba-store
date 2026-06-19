"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Menu, X, Crown, Search, Heart, Sparkles } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

function PromoBanner({ onClose }: { onClose: () => void }) {
  const [promos, setPromos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldShow, setShouldShow] = useState(true);

  useEffect(() => {
    async function fetchPromos() {
      const { data } = await supabase.from("promo_codes").select("*").eq("is_active", true);
      if (data && data.length > 0) {
        setPromos(data);
      } else {
        setShouldShow(false);
        onClose();
      }
    }
    fetchPromos();
  }, [onClose]);

  const allMessages = [
    ...promos.map(p => `🏷️ استخدمي كود "${p.code}" واحصلي على خصم ${p.discount_percentage}%`),
    "🚚 توصيل الى جميع مدن ليبيا والدفع عند الاستلام!",
    "✨ منتجات جديدة كل أسبوع — تابعينا!",
    "💎 جودة فاخرة بأسعار مناسبة",
    "🎁 تغليف هدايا مجاني لجميع الطلبات"
  ];

  useEffect(() => {
    if (allMessages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [promos, allMessages.length]);

  if (!shouldShow || promos.length === 0) return null;

  return (
    <div className="relative bg-gradient-to-r from-luxury-beige/20 via-amber-900/30 to-luxury-beige/20 border-b border-luxury-beige/10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-luxury-beige/10 to-transparent"
        />
      </div>

      <div className="relative max-w-[1500px] mx-auto px-4 py-2 flex items-center justify-between">
        <button onClick={onClose} className="text-luxury-beige/40 hover:text-luxury-beige transition-colors p-1 shrink-0 z-20 relative">
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex % allMessages.length}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-luxury-beige shrink-0" />
              <span className="text-[11px] md:text-xs font-bold text-luxury-cream/80 tracking-wide">
                {allMessages[currentIndex % allMessages.length]}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-luxury-beige shrink-0 hidden sm:block" />
            </motion.div>
          </AnimatePresence>
        </div>

        <Link href="/shop" className="shrink-0 text-[10px] md:text-[11px] font-bold text-dark-900 bg-luxury-beige hover:bg-luxury-gold px-3 py-1 rounded-full transition-all hover:scale-105 shadow-sm shadow-luxury-beige/20 z-20 relative">
          تسوقي الآن
        </Link>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const openSearch = () => {
    setMobileOpen(false);
    const ev = new CustomEvent("openSearch");
    window.dispatchEvent(ev);
  };

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(5,5,5,0)", "rgba(5,5,5,0.95)"]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 20]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "المتجر", href: "/shop" },
    { name: "تتبع الطلب", href: "/track" },
    { name: "من نحن", href: "/#about" },
  ];

  const bannerHeight = showBanner ? "top-[36px]" : "top-0";

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
          >
            <PromoBanner onClose={() => setShowBanner(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ backgroundColor: navBg, backdropFilter: `blur(${navBlur}px)` }}
        className={`fixed ${bannerHeight} left-0 right-0 z-50 border-b border-transparent transition-all duration-500`}
      >
        <div className={`absolute inset-0 transition-all duration-500 ${scrolled ? "border-b border-luxury-beige/10 bg-dark-900/80 backdrop-blur-xl" : ""}`} />

        <div className="relative max-w-[1500px] mx-auto section-padding">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 group relative">
              <div className="relative">
                <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                  <Crown className="w-8 h-8 text-luxury-beige group-hover:text-luxury-gold transition-colors duration-300" />
                </motion.div>
                <div className="absolute inset-0 blur-xl bg-luxury-beige/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold gold-gradient-text leading-tight">هبة الرحمن</span>
                <span className="text-[10px] text-luxury-beige/50 tracking-[0.4em] uppercase font-medium">Luxury Store</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a key={link.name} href={link.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.5 }} className="relative px-5 py-2.5 text-sm text-luxury-cream/60 hover:text-luxury-cream transition-all duration-300 rounded-xl hover:bg-luxury-beige/5 group" whileHover={{ y: -2 }}>
                  {link.name}
                  <motion.span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-luxury-beige to-transparent" initial={{ width: 0 }} whileHover={{ width: "60%" }} transition={{ duration: 0.3 }} />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* زر البحث */}
              <motion.button onClick={openSearch} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800/50 hover:bg-luxury-beige/10 text-luxury-cream/50 hover:text-luxury-beige transition-all duration-300 border border-transparent hover:border-luxury-beige/20">
                <Search className="w-4 h-4" />
              </motion.button>

              {/* ❤️ زر المفضلة مع عداد */}
              <Link href="/wishlist">
                <motion.button whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-dark-800/50 hover:bg-red-500/10 text-luxury-cream/50 hover:text-red-400 transition-all duration-300 border border-transparent hover:border-red-500/20 relative">
                  <Heart className="w-4 h-4" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </Link>

              {/* زر السلة */}
              <motion.button onClick={() => setIsCartOpen(true)} whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-luxury-beige/10 hover:bg-luxury-beige/20 text-luxury-beige transition-all duration-300 border border-luxury-beige/20 hover:border-luxury-beige/40">
                <ShoppingBag className="w-4 h-4" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 180 }} transition={{ type: "spring", stiffness: 500, damping: 25 }} className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-br from-luxury-gold to-luxury-beige text-dark-900 text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-luxury-gold/30">
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* زر القائمة للموبايل */}
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-dark-800/50 text-luxury-cream border border-luxury-beige/10">
                <AnimatePresence mode="wait">
                  {mobileOpen ? <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div> : <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Menu className="w-5 h-5" /></motion.div>}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <div className={`${showBanner ? "h-28" : "h-24"}`} />

      {/* القائمة الجانبية للموبايل */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="fixed inset-0 z-40 lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%", opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0.5 }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="absolute top-0 right-0 h-full w-full max-w-sm bg-dark-900/98 backdrop-blur-2xl border-l border-luxury-beige/10 pt-24 px-8">
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a key={link.name} href={link.href} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }} onClick={() => setMobileOpen(false)} className="text-2xl font-serif text-luxury-cream/70 hover:text-luxury-beige transition-colors py-4 border-b border-luxury-beige/5 hover:border-luxury-beige/20">
                    {link.name}
                  </motion.a>
                ))}

                {/* رابط المفضلة في قائمة الموبايل */}
                <Link href="/wishlist" onClick={() => setMobileOpen(false)}>
                  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="text-2xl font-serif text-luxury-cream/70 hover:text-red-400 transition-colors py-4 border-b border-luxury-beige/5 flex items-center justify-between">
                    <Heart size={20} className="text-red-400" />
                    <span>المفضلة ({wishlistCount})</span>
                  </motion.div>
                </Link>

                {/* زر السلة */}
                <motion.button onClick={() => { setMobileOpen(false); setIsCartOpen(true); }} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="text-2xl font-serif text-luxury-cream/70 hover:text-luxury-beige transition-colors py-4 border-b border-luxury-beige/5 text-right flex items-center justify-between">
                  <ShoppingBag size={20} />
                  <span>السلة ({totalItems})</span>
                </motion.button>

                {/* أيقونات التواصل */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="flex justify-center gap-4 pt-8">
                  <a href="https://wa.me/218935364926" target="_blank" className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all border border-green-500/20">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/heba.alrahman.store" target="_blank" className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 hover:bg-pink-500/20 transition-all border border-pink-500/20">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
                  </a>
                  <a href="https://www.facebook.com/share/18gxGwAqoi" target="_blank" className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://www.tiktok.com/@haybatalrahman.com0" target="_blank" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-all border border-white/10">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v11a4 4 0 1 1-4-4v-3z"/></svg>
                  </a>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}