"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, Crown } from "lucide-react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#C9A96E", "#D4AF37", "#E8D5A3", "#B8956A", "#F0D878"];
    particlesRef.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.x += dx * 0.0003;
          p.y += dy * 0.0003;
        }
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity * 0.1;
        ctx.fill();
      });

      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#C9A96E";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.globalAlpha = 0.03 * (1 - dist / 150);
            ctx.stroke();
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute inset-0 z-[1]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/95 to-[#050505]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-beige/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>
      <div className="absolute inset-0 z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        style={{ y: springY, opacity, scale: springScale }}
        className="relative z-10 text-center section-padding max-w-6xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -30, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mb-8 inline-block"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <Crown className="w-16 h-16 text-luxury-beige mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-luxury-beige/30" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-luxury-beige/5 border border-luxury-beige/20 text-luxury-beige text-sm backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>وجهتكِ العالمية للإكسسوارات الفاخرة</span>
            <Sparkles className="w-4 h-4" />
          </motion.span>
        </motion.div>

        {/* التعديل تم هنا: إزالة كلمة "دار" وتوسيط "هبة الرحمن" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-8"
        >
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight">
            <span className="block gold-gradient-text text-shadow-gold-strong">
              هبة الرحمن
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-32 h-[1px] bg-gradient-to-r from-transparent via-luxury-beige to-transparent mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-lg sm:text-xl md:text-2xl text-luxury-cream/50 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        >
          حيث تلتقي الفخامة بالموضة العالمية. اكتشفي أحدث صيحات الإكسسوارات لعام 2026
          من عطور فاخرة، مجوهرات statement، وحقائب يد iconic
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a href="#categories" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="btn-primary text-base px-10 py-4">
            استكشفي المجموعة
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: "500+", label: "منتج فاخر" },
            { value: "10K+", label: "عميلة سعيدة" },
            { value: "50+", label: "علامة تجارية" },
            { value: "99%", label: "رضا العملاء" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.7 + i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="text-center group cursor-default"
            >
              <div className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold gold-gradient-text mb-2 group-hover:text-shadow-gold transition-all duration-500">
                {stat.value}
              </div>
              <div className="text-sm text-luxury-cream/40 group-hover:text-luxury-cream/60 transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3 cursor-pointer"
          onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="text-xs text-luxury-cream/30 tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-luxury-beige/20 flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-beige/60" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}