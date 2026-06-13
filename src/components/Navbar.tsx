"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ShoppingBag, Menu, X, Crown, Search, PackageSearch } from "lucide-react"; // أضفنا أيقونة التتبع
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import SmartSearch from "./SmartSearch";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const { totalItems, setIsCartOpen } = useCart();

  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(5,5,5,0)", "rgba(5,5,5,0.9)"]);
  const navBlur = useTransform(scrollY, [0, 100], [0, 15]);

  useEffect(() => {
    if (mobileOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen, isSearchOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // تمت إضافة رابط "تتبع طلبك" هنا
  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "الأقسام", href: "/#categories" },
    { name: "المنتجات", href: "/#products" },
    { name: "تتبع طلبك", href: "/track" },
    { name: "من نحن", href: "/#about" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        style={{ backgroundColor: navBg, backdropFilter: `blur(${navBlur}px)` }}
        className="fixed top-0 left-0 right-0 z-[60] transition-all duration-300"
      >
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group z-[70]">
               <motion.div whileHover={{ rotate: 15 }}>
                  <Crown className="w-8 h-8 text-[#D4AF37]" />
               </motion.div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold bg-gradient-to-l from-[#D4AF37] to-[#F5E6BE] bg-clip-text text-transparent leading-tight">
                   هبة الرحمن
                </span>
                <span className="text-[9px] text-white/40 tracking-[0.3em] uppercase">Luxury Store</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors duration-300 font-medium flex items-center gap-1.5 ${
                    link.name === "تتبع طلبك" 
                    ? "text-[#D4AF37] hover:text-white" // تمييز رابط التتبع باللون الذهبي
                    : "text-white/70 hover:text-[#D4AF37]"
                  }`}
                >
                  {link.name === "تتبع طلبك" && <PackageSearch className="w-4 h-4" />}
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              
              {/* زر البحث الذكي */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-white/60 hover:text-[#D4AF37] transition-colors p-2"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Bag Button */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#D4AF37] bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 hover:bg-[#D4AF37]/20 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-[#D4AF37] text-black text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              {/* Mobile Toggle */}
              <button 
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white z-[70] p-2"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* استدعاء نافذة البحث الذكي المخفية */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4 }}
            className="fixed inset-0 bg-[#050505] z-[50] flex flex-col justify-center items-center gap-8 lg:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                onClick={() => setMobileOpen(false)}
                className={`text-3xl font-serif flex items-center gap-3 ${
                  link.name === "تتبع طلبك" ? "text-[#D4AF37]" : "text-white hover:text-[#D4AF37]"
                }`}
              >
                {link.name === "تتبع طلبك" && <PackageSearch className="w-7 h-7" />}
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}