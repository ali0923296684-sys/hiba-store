"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function Lightbox({ images, currentIndex, isOpen, onClose }: LightboxProps) {
  const [index, setIndex] = useState(currentIndex);

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          <button onClick={onClose} className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
            <X size={20} />
          </button>

          <span className="absolute top-6 left-6 text-white/40 text-sm">{index + 1} / {images.length}</span>

          {images.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <ChevronLeft size={22} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20">
                <ChevronRight size={22} />
              </button>
            </>
          )}

          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={images[index]}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setIndex(i); }} className={`w-2 h-2 rounded-full transition-all ${i === index ? "bg-white w-6" : "bg-white/30"}`} />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}