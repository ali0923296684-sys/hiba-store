"use client";

import { motion } from "framer-motion";
import { Truck, Check } from "lucide-react";

export default function LibyaDelivery() {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="relative max-w-[1200px] mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12 border border-green-500/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] to-transparent pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">

            {/* خريطة ليبيا */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-[280px] h-[300px] md:w-[350px] md:h-[380px]">
                <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
                  {/* شكل ليبيا الحقيقي */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    d="M115,95 L118,90 L125,85 L135,82 L142,80 L148,78 L155,80 L162,78 L170,80 L178,78 L185,80 L192,78 L200,80 L210,82 L218,80 L225,82 L232,80 L240,82 L248,85 L255,82 L262,85 L270,88 L278,85 L285,88 L292,90 L300,88 L308,90 L315,92 L322,90 L330,92 L338,95 L345,98 L350,102 L355,108 L358,115 L360,122 L358,130 L355,138 L350,145 L348,150 L345,155 L340,158 L338,162 L335,168 L330,172 L328,178 L325,185 L322,190 L318,195 L315,200 L312,208 L308,215 L305,220 L300,225 L295,232 L290,238 L285,245 L280,252 L275,258 L270,265 L265,272 L260,278 L255,285 L250,290 L245,295 L240,300 L235,308 L230,315 L225,320 L220,328 L215,335 L210,340 L205,348 L200,355 L195,360 L190,365 L185,370 L180,375 L175,378 L170,380 L165,378 L160,375 L155,370 L150,365 L145,358 L140,350 L135,340 L130,330 L125,318 L120,305 L118,290 L115,275 L112,260 L110,245 L108,228 L105,210 L103,192 L102,175 L100,158 L98,140 L100,125 L105,110 L110,100 Z"
                    fill="rgba(34, 197, 94, 0.15)"
                    stroke="#22C55E"
                    strokeWidth="2"
                  />

                  {/* لمعة متحركة */}
                  <motion.circle
                    animate={{
                      cx: [200, 300, 250, 180, 200],
                      cy: [150, 200, 280, 250, 150],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    r="40"
                    fill="url(#glow)"
                    opacity="0.3"
                  />

                  <defs>
                    <radialGradient id="glow">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* نص على الخريطة */}
                  <text x="220" y="220" textAnchor="middle" fill="#22C55E" fontSize="18" fontWeight="bold" opacity="0.8">
                    🇱🇾
                  </text>
                </svg>

                {/* نص تحت الخريطة */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 }}
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 whitespace-nowrap"
                >
                  <span className="text-green-400 text-[11px] font-bold">توصيل شامل لكل ليبيا 🇱🇾</span>
                </motion.div>
              </div>
            </div>

            {/* النص */}
            <div className="w-full md:w-1/2 text-center md:text-right">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-6">
                  <Truck size={14} />
                  توصيل شامل
                </div>

                <h2 className="font-serif text-3xl md:text-4xl font-bold text-luxury-cream mb-4 leading-tight">
                  نوصل لجميع
                  <br />
                  <span className="text-green-400">مناطق ليبيا</span>
                </h2>

                <p className="text-white/40 text-sm leading-relaxed mb-8">
                  أينما كنتِ في ليبيا — نوصل طلبكِ لباب بيتك!
                  <br />
                  كل المدن والمناطق مغطاة بخدمة التوصيل.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "توصيل لكل المدن والمناطق",
                    "الدفع عند الاستلام",
                    "تتبع طلبك لحظة بلحظة",
                    "تغليف آمن ومحمي",
                  ].map((feature, i) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                      className="flex items-center gap-3 justify-center md:justify-end"
                    >
                      <span className="text-white/60 text-sm">{feature}</span>
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-green-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <a href="https://wa.me/218935364926" target="_blank">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-2xl bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 mx-auto md:mr-0 hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                  >
                    <Truck size={18} />
                    اطلبي الآن — نوصل لعندك!
                  </motion.button>
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

