"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ShoppingCart, Heart, Volume2, VolumeX, Loader2, Film, Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

export default function ReelsPage() {
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchReels() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) {
        const withVideos = data.filter((p: any) => p.videos && p.videos.length > 0);
        setReels(withVideos);
      }
      setLoading(false);
    }
    fetchReels();
  }, []);

  // تشغيل/إيقاف الفيديو عند تغيير الريل
  useEffect(() => {
    Object.values(videoRefs.current).forEach((v) => {
      if (v) { v.pause(); v.currentTime = 0; }
    });
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      currentVideo.muted = isMuted;
      currentVideo.play().catch(() => {});
    }
  }, [currentIndex, isMuted]);

  const goNext = () => {
    if (currentIndex < reels.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // السحب (Swipe)
  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.y < -threshold) {
      goNext();
    } else if (info.offset.y > threshold) {
      goPrev();
    }
  };

  // اللمس على الشاشة
  const touchStartY = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartY.current - e.changedTouches[0].clientY;
    if (diff > 80) goNext();
    else if (diff < -80) goPrev();
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const shareReel = async () => {
    const reel = reels[currentIndex];
    if (navigator.share) {
      await navigator.share({
        title: reel.name,
        text: `شوفي ${reel.name} في متجر هبة الرحمن!`,
        url: `https://hibatrahman.xyz/product/${reel.id}`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-center px-4">
        <div>
          <Film className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h1 className="font-serif text-3xl font-bold text-white mb-4">لا توجد ريلز حالياً</h1>
          <p className="text-white/30 mb-8">أضف فيديوهات للمنتجات من لوحة التحكم</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            <ShoppingCart size={18} />تصفحي المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div className="h-screen bg-black flex items-center justify-center overflow-hidden select-none">
      <div
        className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* الفيديوهات */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ y: direction > 0 ? "100%" : "-100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: direction > 0 ? "-100%" : "100%", opacity: 0.5 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            <video
              ref={(el) => { videoRefs.current[currentIndex] = el; }}
              src={currentReel?.videos?.[0]}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* تغميق */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />

        {/* الهيدر */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20 safe-area-top">
          <Link href="/" className="text-white/70 text-sm font-bold bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            ✕ رجوع
          </Link>
          <div className="flex items-center gap-2 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Film size={14} className="text-luxury-beige" />
            <span className="text-white text-sm font-bold">ريلز</span>
          </div>
          <span className="text-white/50 text-xs bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1}/{reels.length}
          </span>
        </div>

        {/* شريط التقدم */}
        <div className="absolute top-14 left-3 right-3 flex gap-1 z-20">
          {reels.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] rounded-full overflow-hidden bg-white/20">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: i <= currentIndex ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        {/* مؤشر السحب */}
        {currentIndex < reels.length - 1 && (
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-44 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
            </div>
            <span className="text-white/30 text-[9px]">اسحبي لفوق</span>
          </motion.div>
        )}

        {/* أزرار جانبية */}
        <div className="absolute right-3 bottom-44 flex flex-col gap-5 z-20">
          {/* المفضلة */}
          <button
            onClick={() => toggleWishlist({
              id: currentReel.id, name: currentReel.name,
              price: currentReel.price, image: currentReel.image,
              category: currentReel.category,
            })}
            className="flex flex-col items-center gap-1"
          >
            <motion.div whileTap={{ scale: 1.3 }} className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Heart size={24} className={isInWishlist(currentReel.id) ? "text-red-400 fill-red-400" : "text-white"} />
            </motion.div>
            <span className="text-white text-[10px]">❤️</span>
          </button>

          {/* الصوت */}
          <button onClick={toggleMute} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              {isMuted ? <VolumeX size={22} className="text-white" /> : <Volume2 size={22} className="text-white" />}
            </div>
            <span className="text-white text-[10px]">{isMuted ? "🔇" : "🔊"}</span>
          </button>

          {/* مشاركة */}
          <button onClick={shareReel} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Share2 size={20} className="text-white" />
            </div>
            <span className="text-white text-[10px]">📤</span>
          </button>

          {/* صورة المنتج */}
          <Link href={`/product/${currentReel.id}`}>
            <motion.div whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/40 shadow-xl">
              <img src={currentReel.image} className="w-full h-full object-cover" />
            </motion.div>
          </Link>
        </div>

        {/* معلومات المنتج */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 pb-8">
          <motion.div
            key={currentIndex}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-luxury-beige text-[10px] tracking-widest uppercase bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
              {currentReel.category}
            </span>
            <h2 className="text-white font-bold text-xl mt-2 mb-1 drop-shadow-lg">{currentReel.name}</h2>
            <p className="text-white/50 text-sm mb-4 line-clamp-2 drop-shadow-md">{currentReel.description}</p>

            <div className="flex items-center gap-3">
              <Link href={`/product/${currentReel.id}`} className="flex-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3.5 rounded-2xl bg-luxury-beige text-dark-900 font-bold text-sm 
                             flex items-center justify-center gap-2 shadow-lg shadow-luxury-beige/20"
                >
                  <ShoppingCart size={16} />
                  اطلبي الآن
                </motion.button>
              </Link>
              <span className="font-serif text-2xl font-bold text-luxury-beige drop-shadow-lg">
                {formatPrice(currentReel.price)}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}