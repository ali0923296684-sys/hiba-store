"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, Volume2, VolumeX, Loader2, Film, Share2, ChevronUp, ChevronDown, X } from "lucide-react";
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
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    async function fetchReels() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (data) setReels(data.filter((p: any) => p.videos && p.videos.length > 0));
      setLoading(false);
    }
    fetchReels();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    el.addEventListener("touchmove", prevent, { passive: false });
    return () => el.removeEventListener("touchmove", prevent);
  }, []);

  useEffect(() => {
    Object.entries(videoRefs.current).forEach(([key, v]) => {
      if (v && Number(key) !== currentIndex) {
        v.pause();
        v.currentTime = 0;
      }
    });
    const current = videoRefs.current[currentIndex];
    if (current) {
      current.muted = isMuted;
      current.play().catch(() => {});
    }
    setShowFullDesc(false);
  }, [currentIndex, isMuted]);

  const goNext = () => {
    if (currentIndex < reels.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
      setTimeout(() => setIsTransitioning(false), 400);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    const diffX = Math.abs(touchStartX.current - e.changedTouches[0].clientX);
    const time = Date.now() - touchStartTime.current;

    // تجاهل السحب الأفقي
    if (diffX > Math.abs(diffY)) return;

    // إذا الوصف مفتوح، أغلقه بدل تغيير الفيديو
    if (showFullDesc) {
      setShowFullDesc(false);
      return;
    }

    if (diffY > 50 || (diffY > 25 && time < 250)) {
      goNext();
    } else if (diffY < -50 || (diffY < -25 && time < 250)) {
      goPrev();
    }
  };

  const toggleVideo = () => {
    const current = videoRefs.current[currentIndex];
    if (!current) return;
    if (current.paused) {
      current.play();
    } else {
      current.pause();
    }
  };

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
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-luxury-gold animate-spin mx-auto mb-3" />
          <p className="text-white/30 text-sm">جاري تحميل الريلز...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-center px-4">
        <div>
          <Film className="w-16 h-16 text-white/10 mx-auto mb-6" />
          <h1 className="font-serif text-2xl font-bold text-white mb-3">لا توجد ريلز حالياً</h1>
          <p className="text-white/30 text-sm mb-6">أضف فيديوهات للمنتجات من لوحة التحكم</p>
          <Link href="/shop" className="bg-luxury-beige text-dark-900 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2">
            <ShoppingCart size={16} />تصفحي المنتجات
          </Link>
        </div>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div
      ref={containerRef}
      className="h-screen bg-black flex items-center justify-center overflow-hidden select-none"
      style={{ overscrollBehavior: "none", touchAction: "none" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-md h-full md:h-[90vh] md:rounded-3xl overflow-hidden">

        {/* الفيديوهات */}
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ y: direction > 0 ? "100%" : "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: direction > 0 ? "-50%" : "50%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
            onClick={toggleVideo}
          >
            <video
              ref={(el) => { videoRefs.current[currentIndex] = el; }}
              src={currentReel?.videos?.[0]}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* تغميق */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50 pointer-events-none z-10" />

        {/* الهيدر */}
        <div className="absolute top-0 left-0 right-0 p-3 pt-10 flex items-center justify-between z-20">
          <Link href="/" className="text-white/80 text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full">
            ✕ رجوع
          </Link>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full">
            <Film size={12} className="text-luxury-beige" />
            <span className="text-white text-xs font-bold">ريلز</span>
          </div>
          <span className="text-white/40 text-[10px] bg-black/40 px-2.5 py-1.5 rounded-full">
            {currentIndex + 1}/{reels.length}
          </span>
        </div>

        {/* شريط التقدم */}
        <div className="absolute top-7 left-3 right-3 flex gap-0.5 z-20">
          {reels.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] rounded-full overflow-hidden bg-white/15" onClick={() => { setDirection(i > currentIndex ? 1 : -1); setCurrentIndex(i); }}>
              <div className={`h-full rounded-full transition-all duration-500 ${i <= currentIndex ? "bg-white w-full" : "w-0"}`} />
            </div>
          ))}
        </div>

        {/* أزرار التنقل (ديسكتوب) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex-col gap-4">
          <button onClick={goPrev} disabled={currentIndex === 0} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/20">
            <ChevronUp size={22} />
          </button>
          <button onClick={goNext} disabled={currentIndex === reels.length - 1} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/20">
            <ChevronDown size={22} />
          </button>
        </div>

        {/* مؤشر السحب (موبايل فقط) */}
        {currentIndex < reels.length - 1 && !showFullDesc && (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-48 left-1/2 -translate-x-1/2 z-20 md:hidden"
          >
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronDown size={14} className="text-white/40" />
            </div>
          </motion.div>
        )}

        {/* أزرار جانبية */}
        <div className="absolute right-3 bottom-48 flex flex-col gap-4 z-20">
          <button
            onClick={() => toggleWishlist({ id: currentReel.id, name: currentReel.name, price: currentReel.price, image: currentReel.image, category: currentReel.category })}
            className="flex flex-col items-center gap-0.5"
          >
            <motion.div whileTap={{ scale: 1.4 }} className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center">
              <Heart size={22} className={isInWishlist(currentReel.id) ? "text-red-400 fill-red-400" : "text-white"} />
            </motion.div>
            <span className="text-white/60 text-[8px]">مفضلة</span>
          </button>

          <button onClick={() => setIsMuted(!isMuted)} className="flex flex-col items-center gap-0.5">
            <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center">
              {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
            </div>
            <span className="text-white/60 text-[8px]">{isMuted ? "صوت" : "كتم"}</span>
          </button>

          <button onClick={shareReel} className="flex flex-col items-center gap-0.5">
            <div className="w-11 h-11 rounded-full bg-black/40 flex items-center justify-center">
              <Share2 size={18} className="text-white" />
            </div>
            <span className="text-white/60 text-[8px]">شارك</span>
          </button>

          <Link href={`/product/${currentReel.id}`}>
            <motion.div whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-lg overflow-hidden border-2 border-white/30">
              <img src={currentReel.image} className="w-full h-full object-cover" />
            </motion.div>
          </Link>
        </div>

        {/* معلومات المنتج */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <AnimatePresence>
            {showFullDesc && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="bg-black/95 p-5 pt-4 rounded-t-3xl max-h-[60vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <button onClick={() => setShowFullDesc(false)} className="text-white/40">
                    <X size={20} />
                  </button>
                  <span className="text-luxury-beige text-xs">{currentReel.category}</span>
                </div>
                <h2 className="text-white font-bold text-xl mb-3">{currentReel.name}</h2>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{currentReel.description}</p>
                <div className="flex items-center gap-3">
                  <Link href={`/product/${currentReel.id}`} className="flex-1">
                    <button className="w-full py-3 rounded-xl bg-luxury-beige text-dark-900 font-bold text-sm flex items-center justify-center gap-2">
                      <ShoppingCart size={16} />اطلبي الآن
                    </button>
                  </Link>
                  <span className="font-serif text-2xl font-bold text-luxury-beige">{formatPrice(currentReel.price)}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!showFullDesc && (
            <motion.div
              key={`info-${currentIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="p-4 pb-6"
            >
              <span className="text-luxury-beige text-[9px] tracking-widest uppercase bg-black/30 px-2 py-0.5 rounded-full">
                {currentReel.category}
              </span>
              <h2 className="text-white font-bold text-lg mt-1.5 mb-0.5">{currentReel.name}</h2>

              {/* الوصف المختصر + زر "المزيد" */}
              <div className="mb-3">
                <p className="text-white/50 text-xs line-clamp-1 inline">{currentReel.description}</p>
                {currentReel.description && currentReel.description.length > 50 && (
                  <button onClick={() => setShowFullDesc(true)} className="text-white/80 text-xs font-bold mr-1 underline">
                    المزيد
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Link href={`/product/${currentReel.id}`} className="flex-1">
                  <motion.button whileTap={{ scale: 0.96 }} className="w-full py-3 rounded-xl bg-luxury-beige text-dark-900 font-bold text-sm flex items-center justify-center gap-2">
                    <ShoppingCart size={14} />اطلبي الآن
                  </motion.button>
                </Link>
                <span className="font-serif text-xl font-bold text-luxury-beige">
                  {formatPrice(currentReel.price)}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}