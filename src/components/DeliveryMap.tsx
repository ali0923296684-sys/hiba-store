"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";

const LIBYA_CITIES: Record<string, { x: number; y: number; region: string }> = {
  "زوارة": { x: 22, y: 18, region: "غرب" },
  "صبراتة": { x: 24, y: 19, region: "غرب" },
  "صرمان": { x: 26, y: 19, region: "غرب" },
  "الزاوية": { x: 28, y: 19, region: "غرب" },
  "جنزور": { x: 30, y: 18, region: "غرب" },
  "طرابلس": { x: 32, y: 18, region: "غرب" },
  "تاجوراء": { x: 34, y: 18, region: "غرب" },
  "القره بوللي": { x: 36, y: 19, region: "غرب" },
  "الخمس": { x: 38, y: 19, region: "غرب" },
  "زليتن": { x: 40, y: 20, region: "وسط" },
  "مصراتة": { x: 43, y: 20, region: "وسط" },
  "سرت": { x: 50, y: 22, region: "وسط" },
  "الهراوة": { x: 53, y: 23, region: "وسط" },
  "بن جواد": { x: 55, y: 23, region: "وسط" },
  "راس لانوف": { x: 57, y: 23, region: "شرق" },
  "البريقة": { x: 59, y: 24, region: "شرق" },
  "اجدابيا": { x: 61, y: 26, region: "شرق" },
  "بنغازي": { x: 65, y: 24, region: "شرق" },
  "المرج": { x: 68, y: 24, region: "شرق" },
  "البيضاء": { x: 70, y: 24, region: "شرق" },
  "شحات": { x: 71, y: 23, region: "شرق" },
  "درنة": { x: 74, y: 23, region: "شرق" },
  "طبرق": { x: 78, y: 22, region: "شرق" },
  "امساعد": { x: 82, y: 22, region: "شرق" },
  "غريان": { x: 30, y: 25, region: "غرب" },
  "يفرن": { x: 28, y: 26, region: "غرب" },
  "الزنتان": { x: 26, y: 27, region: "غرب" },
  "نالوت": { x: 22, y: 27, region: "غرب" },
  "الرجبان": { x: 27, y: 28, region: "غرب" },
  "ككلة": { x: 25, y: 28, region: "غرب" },
  "جادو": { x: 24, y: 27, region: "غرب" },
  "الحرابة": { x: 29, y: 26, region: "غرب" },
  "مزدة": { x: 30, y: 30, region: "غرب" },
  "ترهونة": { x: 34, y: 24, region: "غرب" },
  "بني وليد": { x: 38, y: 28, region: "وسط" },
  "تاورغاء": { x: 42, y: 23, region: "وسط" },
  "هون": { x: 48, y: 32, region: "وسط" },
  "ودان": { x: 47, y: 33, region: "وسط" },
  "سوكنة": { x: 46, y: 34, region: "وسط" },
  "الجفرة": { x: 47, y: 35, region: "وسط" },
  "زلة": { x: 50, y: 34, region: "وسط" },
  "غدامس": { x: 18, y: 32, region: "جنوب" },
  "الشويرف": { x: 35, y: 35, region: "جنوب" },
  "براك": { x: 38, y: 42, region: "جنوب" },
  "أوباري": { x: 35, y: 48, region: "جنوب" },
  "سبها": { x: 40, y: 48, region: "جنوب" },
  "القطرون": { x: 38, y: 55, region: "جنوب" },
  "مرزق": { x: 42, y: 55, region: "جنوب" },
  "أم الأرانب": { x: 36, y: 58, region: "جنوب" },
  "تراغن": { x: 44, y: 52, region: "جنوب" },
  "غات": { x: 28, y: 55, region: "جنوب" },
  "الكفرة": { x: 72, y: 55, region: "جنوب" },
  "تازربو": { x: 65, y: 50, region: "جنوب" },
  "ربيانة": { x: 70, y: 48, region: "جنوب" },
  "جالو": { x: 58, y: 35, region: "شرق" },
  "أوجلة": { x: 57, y: 34, region: "شرق" },
  "العزيزية": { x: 31, y: 21, region: "غرب" },
  "قصر بن غشير": { x: 33, y: 20, region: "غرب" },
  "السواني": { x: 31, y: 20, region: "غرب" },
  "سوق الجمعة": { x: 33, y: 19, region: "غرب" },
  "أبو سليم": { x: 32, y: 19, region: "غرب" },
  "عين زارة": { x: 33, y: 20, region: "غرب" },
  "الماية": { x: 29, y: 20, region: "غرب" },
  "العجيلات": { x: 25, y: 19, region: "غرب" },
  "رقدالين": { x: 23, y: 19, region: "غرب" },
  "الجميل": { x: 21, y: 19, region: "غرب" },
  "مسلاتة": { x: 37, y: 22, region: "غرب" },
  "قصر خيار": { x: 36, y: 21, region: "غرب" },
  "سلوق": { x: 63, y: 26, region: "شرق" },
  "قمينس": { x: 66, y: 25, region: "شرق" },
  "توكرة": { x: 67, y: 24, region: "شرق" },
  "سوسة": { x: 72, y: 23, region: "شرق" },
  "الأبرق": { x: 69, y: 24, region: "شرق" },
  "الحنية": { x: 73, y: 23, region: "شرق" },
  "العقورية": { x: 64, y: 25, region: "شرق" },
  "الابيار": { x: 66, y: 25, region: "شرق" },
  "قنفودة": { x: 64, y: 24, region: "شرق" },
  "سمنو": { x: 48, y: 36, region: "وسط" },
  "الفقهاء": { x: 45, y: 36, region: "وسط" },
  "تمنهنت": { x: 39, y: 45, region: "جنوب" },
  "ادري": { x: 42, y: 50, region: "جنوب" },
  "الشاطئ": { x: 37, y: 43, region: "جنوب" },
  "وادي عتبة": { x: 40, y: 46, region: "جنوب" },
};

export default function DeliveryMap() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filterRegion, setFilterRegion] = useState<string>("الكل");

  const allCityNames = Object.keys(LIBYA_CITIES);

  const filteredMapCities = filterRegion === "الكل"
    ? Object.entries(LIBYA_CITIES)
    : Object.entries(LIBYA_CITIES).filter(([, v]) => v.region === filterRegion);

  const filteredListCities = filterRegion === "الكل"
    ? allCityNames
    : allCityNames.filter(name => LIBYA_CITIES[name]?.region === filterRegion);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-luxury-beige/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs mb-4">
            <Truck className="w-4 h-4" />
            توصيل لكل ليبيا
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            نوصل لكل <span className="gold-gradient-text">مدن ليبيا</span>
          </h2>
          <p className="text-white/40 text-sm mt-3">+80 مدينة ومنطقة — توصيل متوفر لجميع المدن 🇱🇾</p>
        </motion.div>

        {/* فلتر المناطق */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {["الكل", "غرب", "وسط", "شرق", "جنوب"].map(region => (
            <button
              key={region}
              onClick={() => setFilterRegion(region)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${filterRegion === region ? "bg-green-500 text-white" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"}`}
            >
              {region === "الكل" ? "🇱🇾 الكل" : `${region}`}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* الخريطة */}
          <div className="lg:col-span-2">
            <div className="glass-card p-4 md:p-6 relative overflow-hidden" style={{ aspectRatio: "5/4" }}>
              <svg viewBox="0 0 100 70" className="w-full h-full">
                <path
                  d="M18,17 L82,17 L85,20 L83,22 L80,21 L78,22 L75,23 L72,23 L70,24 L68,24 L65,24 L62,25 L60,26 L58,28 L55,30 L52,32 L50,34 L48,36 L46,38 L44,42 L42,48 L40,52 L38,55 L36,58 L34,60 L30,58 L28,55 L26,50 L24,42 L22,35 L20,30 L18,25 Z"
                  fill="rgba(34, 197, 94, 0.03)"
                  stroke="rgba(34, 197, 94, 0.15)"
                  strokeWidth="0.3"
                />

                <path
                  d="M18,17 L22,18 L26,19 L30,18 L34,18 L38,19 L42,20 L46,21 L50,22 L55,23 L60,24 L65,24 L70,24 L75,23 L78,22 L82,22"
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="0.3"
                  strokeDasharray="1,1"
                />

                <text x="50" y="14" textAnchor="middle" fill="rgba(59, 130, 246, 0.2)" fontSize="2.5">البحر المتوسط</text>

                {filteredMapCities.map(([name, pos]) => {
                  const isSelected = selectedCity === name;
                  const isMajor = ["طرابلس", "بنغازي", "مصراتة", "سبها"].includes(name);

                  return (
                    <g key={name} onClick={() => setSelectedCity(name)} className="cursor-pointer">
                      <circle cx={pos.x} cy={pos.y} r="2" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.3">
                        <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>

                      <circle
                        cx={pos.x} cy={pos.y}
                        r={isSelected ? "1.8" : isMajor ? "1.5" : "1"}
                        fill={isSelected ? "#D4AF37" : "#22C55E"}
                        stroke={isSelected ? "#D4AF37" : "transparent"}
                        strokeWidth="0.3"
                      />

                      <text
                        x={pos.x} y={pos.y - 2.5}
                        textAnchor="middle"
                        fill={isSelected ? "#D4AF37" : "rgba(255,255,255,0.5)"}
                        fontSize={isSelected ? "2.2" : isMajor ? "2" : "1.5"}
                        fontWeight={isSelected || isMajor ? "bold" : "normal"}
                      >
                        {name}
                      </text>

                      {isSelected && (
                        <g>
                          <rect x={pos.x - 10} y={pos.y + 2} width="20" height="4" rx="1" fill="rgba(0,0,0,0.8)" stroke="#22C55E" strokeWidth="0.3" />
                          <text x={pos.x} y={pos.y + 4.5} textAnchor="middle" fill="#22C55E" fontSize="2" fontWeight="bold">
                            متوفر التوصيل ✅
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[9px]">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                <span className="text-white/30">توصيل متوفر لكل المدن</span>
              </div>

              <div className="absolute top-3 right-3 text-[9px] text-white/20">
                🇱🇾 {Object.keys(LIBYA_CITIES).length} مدينة
              </div>
            </div>
          </div>

          {/* القائمة */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-white/30">{filteredListCities.length} مدينة</span>
              <h3 className="font-serif text-lg font-bold text-right">جميع المدن</h3>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {filteredListCities.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedCity(name)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCity === name ? "bg-green-500/10 border border-green-500/30" : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]"}`}
                >
                  <div className="text-xs font-bold text-green-400">
                    متوفر ✅
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-luxury-cream">{name}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-3 text-right mt-4">
              <p className="text-green-400/80 text-[10px] leading-relaxed">
                🚚 التوصيل متوفر لجميع مدن ليبيا!
              </p>
              <p className="text-green-400/60 text-[9px] mt-1">
                ✅ الدفع عند الاستلام متاح لكل المناطق
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}