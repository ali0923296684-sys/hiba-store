"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Heart, Search, Film } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const { totalItems, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  // إخفاء عند السكرول لأسفل، إظهار عند السكرول لأعلى
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      setIsVisible(current < lastScroll || current < 100);
      setLastScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // لا يظهر في صفحات معينة
  if (pathname === "/admin" || pathname === "/reels" || pathname === "/checkout") return null;

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent("openSearch"));
  };

  const navItems = [
    { icon: Home, label: "الرئيسية", href: "/", active: pathname === "/" },
    { icon: ShoppingBag, label: "المتجر", href: "/shop", active: pathname === "/shop", badge: 0 },
    { icon: Search, label: "بحث", href: "#", active: false, onClick: openSearch },
    { icon: Heart, label: "المفضلة", href: "/wishlist", active: pathname === "/wishlist", badge: wishlistCount },
    { icon: Film, label: "ريلز", href: "/reels", active: pathname === "/reels" },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-[70] lg:hidden"
    >
      <div className="bg-dark-900/95 backdrop-blur-xl border-t border-luxury-beige/10 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            return item.onClick ? (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex flex-col items-center gap-0.5 p-2 relative"
              >
                <Icon size={22} className="text-white/40" />
                <span className="text-[9px] text-white/40">{item.label}</span>
              </button>
            ) : (
              <Link key={item.label} href={item.href}>
                <div className={`flex flex-col items-center gap-0.5 p-2 relative ${item.active ? "text-luxury-beige" : "text-white/40"}`}>
                  <div className="relative">
                    <Icon size={22} />
                    {item.badge && item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px]">{item.label}</span>
                  {item.active && (
                    <motion.div layoutId="bottomNavIndicator" className="absolute -top-0.5 w-6 h-0.5 bg-luxury-beige rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}