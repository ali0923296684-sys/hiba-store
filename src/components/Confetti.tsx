"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  isActive: boolean;
}

export default function Confetti({ isActive }: ConfettiProps) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        color: ["#D4AF37", "#FFD700", "#C0C0C0", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8A5C"][Math.floor(Math.random() * 8)],
        size: Math.random() * 10 + 5,
        rotation: Math.random() * 360,
        delay: Math.random() * 0.5,
        type: Math.random() > 0.5 ? "circle" : "rect",
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => setParticles([]), 4000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                x: p.x,
                y: -20,
                rotate: 0,
                opacity: 1,
                scale: 1,
              }}
              animate={{
                y: window.innerHeight + 50,
                rotate: p.rotation + 720,
                opacity: [1, 1, 0.8, 0],
                x: p.x + (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: p.delay,
                ease: "easeOut",
              }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.type === "rect" ? p.size * 0.6 : p.size,
                backgroundColor: p.color,
                borderRadius: p.type === "circle" ? "50%" : "2px",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}