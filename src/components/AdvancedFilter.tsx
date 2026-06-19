"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

interface FilterProps {
  categories: string[];
  onFilter: (filters: FilterState) => void;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  rating: number;
  sortBy: string;
}

const defaultFilters: FilterState = {
  category: "الكل",
  minPrice: 0,
  maxPrice: 5000,
  rating: 0,
  sortBy: "newest",
};

export default function AdvancedFilter({ categories, onFilter }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const applyFilters = () => {
    onFilter(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilter(defaultFilters);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-800/50 border border-luxury-beige/10 
                   text-luxury-cream/60 hover:text-luxury-beige hover:border-luxury-beige/30 transition-all text-sm"
      >
        <SlidersHorizontal size={16} />
        فلتر متقدم
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-900 border border-luxury-beige/20 rounded-t-3xl md:rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <button onClick={resetFilters} className="text-xs text-luxury-beige flex items-center gap-1">
                  <RotateCcw size={12} />
                  إعادة تعيين
                </button>
                <h3 className="text-lg font-serif font-bold">🔍 فلتر متقدم</h3>
                <button onClick={() => setIsOpen(false)}><X size={20} className="text-white/40" /></button>
              </div>

              <div className="space-y-6 text-right">
                {/* الترتيب */}
                <div>
                  <p className="text-sm font-bold text-luxury-cream mb-3">ترتيب حسب</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "newest", label: "الأحدث" },
                      { value: "price_low", label: "السعر: الأقل" },
                      { value: "price_high", label: "السعر: الأعلى" },
                      { value: "rating", label: "التقييم" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFilters({ ...filters, sortBy: opt.value })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          filters.sortBy === opt.value
                            ? "bg-luxury-beige text-dark-900"
                            : "bg-white/5 text-white/60 border border-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* نطاق السعر */}
                <div>
                  <p className="text-sm font-bold text-luxury-cream mb-3">
                    نطاق السعر: {filters.minPrice} - {filters.maxPrice} د.ل
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30">من</span>
                      <input
                        type="range" min="0" max="5000" step="50"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                        className="flex-1 accent-luxury-beige"
                      />
                      <span className="text-xs text-luxury-beige w-16 text-left">{filters.minPrice}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-white/30">إلى</span>
                      <input
                        type="range" min="0" max="5000" step="50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                        className="flex-1 accent-luxury-beige"
                      />
                      <span className="text-xs text-luxury-beige w-16 text-left">{filters.maxPrice}</span>
                    </div>
                  </div>
                </div>

                {/* التقييم */}
                <div>
                  <p className="text-sm font-bold text-luxury-cream mb-3">الحد الأدنى للتقييم</p>
                  <div className="flex gap-2 justify-end">
                    {[0, 3, 4, 4.5, 5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setFilters({ ...filters, rating: r })}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          filters.rating === r
                            ? "bg-luxury-gold text-dark-900"
                            : "bg-white/5 text-white/60 border border-white/5"
                        }`}
                      >
                        {r === 0 ? "الكل" : `⭐ ${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* زر التطبيق */}
                <button
                  onClick={applyFilters}
                  className="w-full py-4 rounded-xl bg-luxury-beige text-dark-900 font-bold text-sm"
                >
                  تطبيق الفلتر
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}