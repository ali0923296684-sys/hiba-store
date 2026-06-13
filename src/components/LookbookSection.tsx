"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ZoomIn, Heart } from "lucide-react";

const lookbookImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop", title: "إطلالة المساء", category: "سهرة" },
  { id: 2, src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop", title: "أناقة العمل", category: "عمل" },
  { id: 3, src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=1000&fit=crop", title: "إطلالة نهارية", category: "يومي" },
  { id: 4, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop", title: "رياضي أنيق", category: "رياضي" },
  { id: 5, src: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&h=1000&fit=crop", title: "كلاسيكي فاخر", category: "كلاسيكي" },
  { id: 6, src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop", title: "موضة الشارع", category: "عصري" },
];

export default function LookbookSection() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedImages((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="lookbook" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-luxury-beige/[0.01] rounded-full blur-[200px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/5 border border-luxury-beige/10 text-luxury-beige text-sm mb-6"
          >
            <Camera className="w-4 h-4" />
            لوك بوك
          </motion.span>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-luxury-cream mb-6 leading-tight">
            إطلالات <span className="gold-gradient-text text-shadow-gold">ملهمة</span>
          </h2>
          <p className="text-luxury-cream/40 text-lg max-w-2xl mx-auto leading-relaxed">
            استلهمي من مجموعة الإطلالات المختارة لكل مناسبة وكل mood
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {lookbookImages.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative group cursor-pointer overflow-hidden rounded-2xl ${
                i === 0 || i === 3 ? "md:row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
              onClick={() => setSelectedImage(img.id)}
            >
              <img
                src={img.src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
                <span className="text-luxury-beige/70 text-xs font-medium tracking-wider uppercase mb-1">
                  {img.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-luxury-cream">
                  {img.title}
                </h3>
              </div>

              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(img.id);
                }}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-900/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    likedImages.has(img.id)
                      ? "text-red-400 fill-red-400"
                      : "text-luxury-cream/60"
                  }`}
                />
              </motion.button>

              {/* Zoom Icon */}
              <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-dark-900/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                <ZoomIn className="w-4 h-4 text-luxury-cream/60" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-8"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center text-luxury-cream/60 hover:text-luxury-cream z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <motion.img
              src={lookbookImages.find((i) => i.id === selectedImage)?.src}
              alt=""
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
