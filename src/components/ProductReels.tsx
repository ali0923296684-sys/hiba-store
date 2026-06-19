"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ShoppingCart, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default function ProductReels() {
  const [reels, setReels] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchReels() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .not("videos", "eq", "{}")
        .limit(10);
      if (data) {
        const withVideos = data.filter((p: any) => p.videos && p.videos.length > 0);
        setReels(withVideos);
      }
    }
    fetchReels();
  }, []);

  if (reels.length === 0) return null;

  const nextReel = () => setCurrentIndex((prev) => (prev + 1) % reels.length);
  const prevReel = () => setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);

  return (
    <>
      {/* زر فتح الريلز */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 left-6 z-[80] w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 
                   rounded-full shadow-2xl shadow-pink-500/30 flex items-center justify-center
                   hover:shadow-pink-500/50 transition-shadow"
      >
        <Play size={20} className="text-white fill-white ml-0.5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
          {reels.length}
        </span>
      </motion.button>

      {/* نافذة الريلز */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
          >
            {/* زر الإغلاق */}
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <X size={20} />
            </button>

            {/* أزرار التنقل */}
            <button onClick={prevReel} className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ChevronUp size={20} />
            </button>
            <button onClick={nextReel} className="absolute bottom-1/4 left-1/2 -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ChevronDown size={20} />
            </button>

            {/* الفيديو */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="w-full max-w-sm h-[80vh] relative rounded-3xl overflow-hidden"
              >
                <video
                  src={reels[currentIndex]?.videos?.[0]}
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* معلومات المنتج */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-bold text-lg mb-1">{reels[currentIndex]?.name}</h3>
                  <p className="text-white/60 text-sm mb-3 line-clamp-2">{reels[currentIndex]?.description}</p>
                  <div className="flex items-center justify-between">
                    <Link href={`/product/${reels[currentIndex]?.id}`} onClick={() => setIsOpen(false)}>
                      <button className="px-6 py-2.5 rounded-full bg-luxury-beige text-dark-900 text-sm font-bold flex items-center gap-2">
                        <ShoppingCart size={14} />
                        تسوقي الآن
                      </button>
                    </Link>
                    <span className="text-2xl font-serif font-bold text-luxury-beige">
                      {formatPrice(reels[currentIndex]?.price)}
                    </span>
                  </div>
                </div>

                {/* عداد */}
                <div className="absolute top-6 left-6 text-white/40 text-xs">
                  {currentIndex + 1} / {reels.length}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
