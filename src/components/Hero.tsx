"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, Crown, Play, Volume2, VolumeX } from "lucide-react";

interface Particle {
  x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; color: string;
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#C9A96E", "#D4AF37", "#E8D5A3", "#B8956A", "#F0D878"];
    const particleCount = window.innerWidth < 768 ? 35 : 80;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      size: Math.random() * 2.5 + 0.5, speedX: (Math.random() - 0.5) * 0.3, speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.1, color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current.forEach((p) => {
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) { p.x += dx * 0.0003; p.y += dy * 0.0003; }
        p.x += p.speedX; p.y += p.speedY;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity * 0.1; ctx.fill();
      });

      if (window.innerWidth >= 768) {
        ctx.globalAlpha = 0.03; ctx.strokeStyle = "#C9A96E"; ctx.lineWidth = 0.5;
        for (let i = 0; i < particlesRef.current.length; i++) {
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const dx = particlesRef.current[i].x - particlesRef.current[j].x;
            const dy = particlesRef.current[i].y - particlesRef.current[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
              ctx.beginPath(); ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
              ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
              ctx.globalAlpha = 0.03 * (1 - dist / 150); ctx.stroke();
            }
          }
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationRef.current); };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4"
      onMouseMove={handleMouseMove}
    >
      {/* ====== الفيديو الترويجي في الخلفية ====== */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${videoLoaded ? 'opacity-30' : 'opacity-0'}`}
        >
          <source src="https://videos.pexels.com/video-files/5536991/5536991-uhd_2560_1440_25fps.mp4" type="video/mp4" />
        </video>

        {/* طبقة تغميق فوق الفيديو */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-[#050505]/70 to-[#050505]" />
        <div className="absolute inset-0 bg-[#050505]/40" />
      </div>

      {/* زر الصوت */}
      {videoLoaded && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={toggleMute}
          className="absolute bottom-24 md:bottom-32 left-6 z-20 w-10 h-10 rounded-full 
                     bg-dark-900/50 backdrop-blur-sm border border-luxury-beige/20 
                     flex items-center justify-center text-luxury-beige/60 
                     hover:text-luxury-beige hover:bg-dark-900/70 transition-all"
          title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </motion.button>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />

      <div className="absolute inset-0 z-[2]">
        <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-luxury-beige/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-luxury-gold/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        style={{ y: springY, opacity, scale: springScale }}
        className="relative z-10 text-center max-w-6xl mx-auto"
      >
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="mb-6 md:mb-8 inline-block">
          <motion.div animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="relative">
            <Crown className="w-12 h-12 md:w-16 md:h-16 text-luxury-beige mx-auto" />
            <div className="absolute inset-0 blur-2xl bg-luxury-beige/30" />
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full bg-luxury-beige/5 border border-luxury-beige/20 text-luxury-beige text-[10px] md:text-sm backdrop-blur-sm">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span>وجهتكِ العالمية للإكسسوارات الفاخرة</span>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }} className="mb-6 md:mb-8">
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-tight tracking-tight">
            <span className="block gold-gradient-text text-shadow-gold-strong">
              هبة الرحمن
            </span>
          </h1>
        </motion.div>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1, delay: 1 }} className="w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-luxury-beige to-transparent mx-auto mb-6 md:mb-8" />

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.1 }} className="text-base sm:text-lg md:text-2xl text-luxury-cream/50 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-light px-2">
          حيث تلتقي الفخامة بالموضة العالمية. اكتشفي أحدث صيحات الإكسسوارات لعام 2026 من عطور فاخرة، مجوهرات، وحقائب يد.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a href="/shop" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="btn-primary text-base px-10 py-4 w-full sm:w-auto max-w-xs">
            استكشفي المجموعة
          </motion.a>
          <motion.a href="#products" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-luxury-beige/60 hover:text-luxury-beige transition-colors text-sm border border-luxury-beige/20 px-8 py-4 rounded-2xl hover:bg-luxury-beige/5 w-full sm:w-auto max-w-xs justify-center">
            <Play size={16} className="fill-current" />
            شاهدي المنتجات
          </motion.a>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }} className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { value: "500+", label: "منتج فاخر" },
            { value: "10K+", label: "عميلة سعيدة" },
            { value: "50+", label: "علامة تجارية" },
            { value: "99%", label: "رضا العملاء" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.7 + i * 0.1, duration: 0.5 }} className="text-center group cursor-default">
              <div className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold gold-gradient-text mb-1 md:mb-2">
                {stat.value}
              </div>
              <div className="text-[10px] md:text-sm text-luxury-cream/40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }} className="hidden md:block absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }} className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}>
          <span className="text-xs text-luxury-cream/30 tracking-widest uppercase">Scroll</span>
          <div className="w-6 h-10 rounded-full border border-luxury-beige/20 flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
              <div className="w-1.5 h-1.5 rounded-full bg-luxury-beige/60" />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}