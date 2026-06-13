"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Award, Gem, Truck, Headphones, Sparkles, Shield } from "lucide-react";

const features = [
  {
    icon: <Gem className="w-7 h-7" />,
    title: "جودة لا تُضاهى",
    desc: "نختار كل منتج بعناية فائقة لنضمن لكِ أعلى معايير الجودة والفخامة",
  },
  {
    icon: <Truck className="w-7 h-7" />,
    title: "توصيل سريع",
    desc: "نوصل طلباتكِ في أسرع وقت ممكن مع تغليف فاخر يحفظ جودة المنتج",
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: "أصلية 100%",
    desc: "نضمن أصالة كل منتج مع شهادات ضمان من المصنع مباشرة",
  },
  {
    icon: <Headphones className="w-7 h-7" />,
    title: "دعم مخصص",
    desc: "فريقنا جاهز لمساعدتكِ على مدار الساعة عبر واتساب والبريد",
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: "ضمان استبدال",
    desc: "سياسة استبدال واسترجاع مرنة خلال 14 يوم من استلام الطلب",
  },
  {
    icon: <Sparkles className="w-7 h-7" />,
    title: "تغليف فاخر",
    desc: "كل طلب يأتي بتغليف فاخر يليق بقيمة المنتج ومناسب للهدايا",
  },
];

function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="font-serif text-5xl sm:text-6xl font-bold gold-gradient-text"
    >
      {isInView ? (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CountUp end={target} />
          {suffix}
        </motion.span>
      ) : (
        "0"
      )}
    </motion.span>
  );
}

function CountUp({ end }: { end: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
    >
      {isInView && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatedNumber value={end} />
        </motion.span>
      )}
    </motion.span>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

import { useState, useEffect } from "react";

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const contentY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={containerRef} id="about" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-luxury-beige/[0.015] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-luxury-gold/[0.01] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-[1500px] mx-auto section-padding">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left - Image with Parallax */}
          <motion.div
            style={{ y: imageY }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-[2rem] overflow-hidden aspect-[3/4] group"
            >
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1067&fit=crop"
                alt="دار هبة الرحمن"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />

              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-8 -right-4 sm:right-8 glass-card p-8 max-w-[300px]"
              >
                <Counter target={10} suffix="+" />
                <div className="text-luxury-cream/50 text-sm mt-2 leading-relaxed">
                  سنوات من الخبرة في عالم الفخامة والأناقة
                </div>
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 border border-luxury-beige/10 rounded-3xl" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-luxury-beige/5 rounded-2xl" />
            <div className="absolute top-1/2 -right-4 w-2 h-32 bg-gradient-to-b from-luxury-beige/30 to-transparent rounded-full" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            style={{ y: contentY }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-luxury-beige/5 border border-luxury-beige/10 text-luxury-beige text-sm mb-8"
            >
              <Sparkles className="w-4 h-4" />
              من نحن
            </motion.span>

            <h2 className="font-serif text-5xl sm:text-6xl font-bold text-luxury-cream mb-8 leading-[1.1]">
              قصة{" "}
              <span className="gold-gradient-text text-shadow-gold">الفخامة</span>{" "}
              تبدأ من هنا
            </h2>

            <p className="text-luxury-cream/50 leading-relaxed mb-10 text-lg">
              دار هبة الرحمن ليست مجرد متجر، بل هي وجهة للأناقة والتميز. منذ تأسيسنا،
              رسالتنا واضحة: تقديم منتجات فاخرة بجودة استثنائية لكل امرأة تبحث عن التميز.
              نؤمن بأن الفخامة ليست في السعر فقط، بل في التجربة الكاملة.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="p-6 rounded-2xl bg-dark-800/30 border border-luxury-beige/5 hover:border-luxury-beige/20 hover:bg-dark-800/50 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-beige/10 to-luxury-gold/5 flex items-center justify-center text-luxury-beige mb-4 group-hover:scale-110 transition-transform duration-300 border border-luxury-beige/10">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-luxury-cream mb-2 group-hover:text-luxury-beige transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-luxury-cream/35 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
