"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ShoppingCart, Heart, ChevronUp, ChevronDown, Volume2, VolumeX, Loader2, Film } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";

export default function ReelsPage() {
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const nextReel = () => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % reels.length);
  };

  const prevReel = () => {
    if (reels.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + reels.length) % reels.length);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const currentReel = reels[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-luxury-gold animate-spin mx-auto mb-4" />
          <p className="text-luxury-cream/40 font-serif">جاري تحميل الريلز...</p>
        </div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-center px-4">
        <div>
          <div className="w-24 h-24 rounded-full bg-white/[0.02] flex items-center justify-center mx-auto mb-6">
            <Film className="w-12 h-12 text-white/10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-luxury-cream mb-4">لا توجد ريلز حالياً</h1>
          <p className="text-white/30 mb-8">أضف فيديوهات للمنتجات من لوحة التحكم لتظهر هنا</p>
          <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-8 py-4">
            <ShoppingCart size={18} />
            تصفحي المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative w-full max-w-md h-screen md:h-[90vh] md:rounded-3xl overflow-hidden">

        {/* الفيديو */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <video
              ref={videoRef}
              src={currentReel?.videos?.[0]}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />
          </motion.div>
        </AnimatePresence>

        {/* تغميق */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* إيقاف مؤقت */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center">
                <Play size={40} className="text-white fill-white ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* الهيدر */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
          <Link href="/" className="text-white/60 text-sm font-bold hover:text-white transition-colors">
            ✕ رجوع
          </Link>
          <div className="flex items-center gap-2">
            <Film size={16} className="text-luxury-beige" />
            <span className="text-white font-bold text-sm">ريلز هبة الرحمن</span>
          </div>
          <span className="text-white/40 text-xs">{currentIndex + 1}/{reels.length}</span>
        </div>

        {/* شريط التقدم */}
        <div className="absolute top-14 left-4 right-4 flex gap-1 z-20">
          {reels.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
              <div className={`h-full rounded-full transition-all duration-300 ${i === currentIndex ? "bg-white w-full" : i < currentIndex ? "bg-white/60 w-full" : "w-0"}`} />
            </div>
          ))}
        </div>

        {/* أزرار جانبية */}
        <div className="absolute right-4 bottom-40 flex flex-col gap-5 z-20">
          {/* المفضلة */}
          <button
            onClick={() => toggleWishlist({
              id: currentReel.id,
              name: currentReel.name,
              price: currentReel.price,
              image: currentReel.image,
              category: currentReel.category,
            })}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Heart size={22} className={isInWishlist(currentReel.id) ? "text-red-400 fill-red-400" : "text-white"} />
            </div>
            <span className="text-white text-[10px]">المفضلة</span>
          </button>

          {/* الصوت */}
          <button onClick={toggleMute} className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              {isMuted ? <VolumeX size={22} className="text-white" /> : <Volume2 size={22} className="text-white" />}
            </div>
            <span className="text-white text-[10px]">{isMuted ? "صوت" : "كتم"}</span>
          </button>

          {/* التسوق */}
          <Link href={`/product/${currentReel.id}`}>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 rounded-full bg-luxury-beige flex items-center justify-center">
                <ShoppingCart size={20} className="text-dark-900" />
              </div>
              <span className="text-white text-[10px]">تسوقي</span>
            </div>
          </Link>
        </div>

        {/* أزرار التنقل */}
        <button onClick={prevReel} className="absolute top-1/3 left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronUp size={24} />
        </button>
        <button onClick={nextReel} className="absolute bottom-[45%] left-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
          <ChevronDown size={24} />
        </button>

        {/* معلومات المنتج */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="mb-4">
            <span className="text-luxury-beige text-[10px] tracking-widest uppercase">{currentReel.category}</span>
            <h2 className="text-white font-bold text-xl mt-1">{currentReel.name}</h2>
            <p className="text-white/50 text-sm mt-1 line-clamp-2">{currentReel.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <Link href={`/product/${currentReel.id}`} className="flex-1 mr-3">
              <button className="w-full py-3 rounded-2xl bg-luxury-beige text-dark-900 font-bold text-sm flex items-center justify-center gap-2 hover:bg-luxury-gold transition-colors">
                <ShoppingCart size={16} />
                اطلبي الآن
              </button>
            </Link>
            <span className="font-serif text-2xl font-bold text-luxury-beige">
              {formatPrice(currentReel.price)}
            </span>
          </div>
        </div>

        {/* صورة المنتج المصغرة */}
        <Link href={`/product/${currentReel.id}`} className="absolute bottom-6 right-6 z-20">
          <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-white/30 shadow-xl">
            <img src={currentReel.image} className="w-full h-full object-cover" />
          </div>
        </Link>
      </div>
    </div>
  );
}