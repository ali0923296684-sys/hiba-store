"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-24 left-4 z-[80] w-11 h-11 rounded-full bg-luxury-beige/20 border border-luxury-beige/30 flex items-center justify-center text-luxury-beige hover:bg-luxury-beige hover:text-dark-900 transition-all backdrop-blur-sm"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}