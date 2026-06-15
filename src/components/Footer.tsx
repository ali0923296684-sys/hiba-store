"use client";

import { motion } from "framer-motion";
import { Crown, Instagram, Facebook, Phone, MapPin, Heart } from "lucide-react";

export default function Footer() {
  
  const socialLinks = [
    { 
      label: "Facebook", 
      href: "https://www.facebook.com/share/198uN6sRZi/?mibextid=wwXIfr", 
      icon: <Facebook className="w-4 h-4" /> 
    },
    { 
      label: "TikTok", 
      href: "https://www.tiktok.com/@haybatalrahman.com0?_r=1&_t=ZS-97AsLQpaBNv", 
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v3a3 3 0 0 1-3-3v11a4 4 0 1 1-4-4v-3z"></path>
        </svg>
      )
    },
    { 
      label: "Instagram", 
      href: "https://www.instagram.com/heba.alrahman.store?igsh=c3Flc2R1eWV1cTk2&utm_source=qr", // ✅ تم إضافة رابط الإنستقرام
      icon: <Instagram className="w-4 h-4" /> 
    },
  ];

  return (
    <footer className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-luxury-beige/30 to-transparent" />
      </div>

      <div className="relative bg-[#080808]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[200px] md:h-[300px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />

        <div className="relative max-w-[1500px] mx-auto section-padding py-14 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 text-center md:text-right" dir="rtl">
            
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-2 lg:col-span-1 flex flex-col items-center md:items-start"
            >
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="relative">
                  <Crown className="w-9 h-9 md:w-10 md:h-10 text-luxury-beige" />
                  <div className="absolute inset-0 blur-xl bg-luxury-beige/20" />
                </div>
                <div>
                  <span className="font-serif text-xl md:text-2xl font-bold gold-gradient-text block">
                    هبة الرحمن
                  </span>
                  <span className="text-[9px] md:text-[10px] text-luxury-beige/40 tracking-[0.3em] uppercase font-medium">
                    Luxury Store
                  </span>
                </div>
              </div>
              <p className="text-luxury-cream/40 text-xs md:text-sm leading-relaxed mb-6 max-w-xs">
                وجهتكِ الأولى للتسوق الفاخر. نقدم لكِ أرقى المنتجات بجودة استثنائية وتجربة تليق بكِ.
              </p>
              
              {/* أيقونات التواصل */}
              <div className="flex justify-center md:justify-start gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-dark-800/50 flex items-center justify-center text-luxury-beige hover:text-luxury-gold transition-all duration-300 border border-luxury-beige/5 hover:border-luxury-beige/20"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="font-serif text-base md:text-lg font-bold text-luxury-cream mb-5 md:mb-8">
                روابط سريعة
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {[
                  { name: "الرئيسية", href: "/" },
                  { name: "المنتجات", href: "/#products" },
                  { name: "تتبع طلبك", href: "/track" },
                  { name: "من نحن", href: "/#about" },
                ].map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-luxury-cream/40 hover:text-luxury-beige transition-all duration-300 text-xs md:text-sm block">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-serif text-base md:text-lg font-bold text-luxury-cream mb-5 md:mb-8">
                الفئات
              </h4>
              <ul className="space-y-3 md:space-y-4">
                {["عطور فاخرة", "حقائب يد", "مجوهرات", "إكسسوارات"].map((cat) => (
                  <li key={cat}>
                    <a href="/#categories" className="text-luxury-cream/40 hover:text-luxury-beige transition-all duration-300 text-xs md:text-sm block">
                      {cat}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="col-span-2 lg:col-span-1 flex flex-col items-center md:items-start"
            >
              <h4 className="font-serif text-base md:text-lg font-bold text-luxury-cream mb-5 md:mb-8">
                تواصل معنا
              </h4>
              <ul className="space-y-4">
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-luxury-beige/5 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-luxury-beige/60" />
                  </div>
                  <div className="text-right">
                    <p className="text-luxury-cream/30 text-[10px] mb-0.5">واتساب / هاتف</p>
                    <span className="text-luxury-cream/60 text-sm" dir="ltr">+218 93 147 3373</span>
                  </div>
                </li>
                <li className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-luxury-beige/5 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-luxury-beige/60" />
                  </div>
                  <div className="text-right">
                    <p className="text-luxury-cream/30 text-[10px] mb-0.5">الموقع</p>
                    <span className="text-luxury-cream/60 text-sm">ليبيا - طرابلس</span>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* الشريط السفلي */}
        <div className="border-t border-luxury-beige/5">
          <div className="max-w-[1500px] mx-auto section-padding py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-luxury-cream/25 text-xs md:text-sm text-center">
              © 2026 هبة الرحمن. جميع الحقوق محفوظة.
            </p>
            <p className="text-luxury-cream/25 text-xs md:text-sm flex items-center gap-1.5">
              صُنع بـ <Heart className="w-3.5 h-3.5 text-red-400/60 fill-red-400/60" /> في ليبيا
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}