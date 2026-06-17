"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, X, Loader2, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ← أضفنا هذا السطر

interface SmartSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SmartSearch({ isOpen, onClose }: SmartSearchProps) {
  const router = useRouter() // ← أضفنا هذا السطر
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // ← دالة الخروج الجديدة
  const handleExit = () => {
    onClose(); // اقفل نافذة البحث
    router.back(); // ارجع للصفحة السابقة
  }

  // دالة البحث في قاعدة البيانات
  useEffect(() => {
    const searchProducts = async () => {
      setIsSearching(true);
      try {
        let dbQuery = supabase.from('products').select('*').lte('price', maxPrice);
        
        if (query.trim() !== "") {
          dbQuery = dbQuery.ilike('name', `%${query}%`);
        }

        const { data, error } = await dbQuery.limit(8);
        if (error) throw error;
        if (data) setResults(data);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(() => {
      searchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, maxPrice]);

  // دالة البحث بالصوت
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("متصفحك لا يدعم البحث الصوتي.");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ar-SA';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.95 }}
            className="w-full max-w-3xl bg-dark-900 border border-luxury-beige/20 rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative"
          >

            {/* ← ← ← زر الخروج الجديد في الأعلى يمين */}
            <button
              onClick={handleExit}
              className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition-all"
            >
              <X size={22} />
            </button>

            {/* شريط البحث (معدل للعربية) */}
            <div className="p-4 pr-16 border-b border-white/5 flex items-center gap-3 bg-dark-800/50">
              <Search className="w-6 h-6 text-luxury-beige order-last" />
              <input
                type="text"
                autoFocus
                placeholder="ابحثي عن حقيبة، عطر، أو لون..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xl text-luxury-cream placeholder:text-white/20 text-right"
              />
              
              {/* أزرار التحكم في اليسار */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={startVoiceSearch}
                  className={`p-3 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-white/50 hover:bg-luxury-beige/20 hover:text-luxury-beige'}`}
                  title="بحث بالصوت"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-3 rounded-full transition-all ${showFilters ? 'bg-luxury-beige text-dark-900' : 'bg-white/5 text-white/50 hover:bg-luxury-beige/20 hover:text-luxury-beige'}`}
                  title="تصفية بالسعر"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* فلتر السعر */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 py-4 bg-dark-800 border-b border-white/5 overflow-hidden"
                >
                  <p className="text-sm text-luxury-beige mb-3 text-right">ميزانيتكِ: أظهر المنتجات حتى {formatPrice(maxPrice)}</p>
                  <input 
                    type="range" 
                    min="50" max="5000" step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-luxury-beige"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 mt-2 font-mono">
                    <span>50 د.ل</span>
                    <span>5000 د.ل</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* النتائج */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#050505]">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center py-20 text-luxury-beige">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm">جاري البحث بذكاء...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`} onClick={onClose} className="glass-card-hover p-3 rounded-2xl group block">
                      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-dark-800">
                        <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <h4 className="text-xs font-bold text-luxury-cream line-clamp-1 mb-1 group-hover:text-luxury-beige text-right">{product.name}</h4>
                      <p className="text-sm font-serif gold-gradient-text font-bold text-right">{formatPrice(product.price)}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 opacity-50">
                  <Search className="w-12 h-12 mx-auto mb-4 text-luxury-beige/30" />
                  <p>لم نجد منتجات تطابق بحثكِ.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}