"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  time: string;
  buttons?: QuickButton[];
}

interface QuickButton {
  label: string;
  value: string;
}

const AUTO_REPLIES: { keywords: string[]; reply: string; buttons?: QuickButton[] }[] = [
  {
    keywords: ["سلام", "هلا", "مرحبا", "هاي", "السلام", "اهلا", "أهلا"],
    reply: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أساعدكِ اليوم؟",
    buttons: [
      { label: "🛍️ تصفح المنتجات", value: "المنتجات" },
      { label: "💰 الأسعار", value: "الأسعار" },
      { label: "🚚 التوصيل", value: "التوصيل" },
      { label: "📞 تواصل معنا", value: "تواصل" },
    ],
  },
  {
    keywords: ["المنتجات", "منتجات", "شنو عندكم", "ايش عندكم", "تبيعون", "أصناف"],
    reply: "عندنا تشكيلة فخمة تشمل:\n\n👜 حقائب فاخرة\n⌚ ساعات أنيقة\n🧴 عطور مميزة\n💍 إكسسوارات\n👗 ملابس نسائية\n\nتقدرين تتصفحين كل المنتجات من صفحة المتجر! 🛍️",
    buttons: [
      { label: "🛒 زيارة المتجر", value: "رابط_المتجر" },
      { label: "💰 الأسعار", value: "الأسعار" },
    ],
  },
  {
    keywords: ["السعر", "الأسعار", "كم سعر", "بكم", "ثمن", "غالي", "رخيص", "سعر"],
    reply: "أسعارنا تبدأ من 25 د.ل وتوصل لـ 500 د.ل حسب المنتج 💎\n\nتقدرين تشوفين سعر كل منتج في صفحة المتجر.\n\nوعندنا عروض وخصومات دائمة! 🎉",
    buttons: [
      { label: "🛒 تصفح المنتجات", value: "المنتجات" },
      { label: "🏷️ العروض", value: "العروض" },
    ],
  },
  {
    keywords: ["توصيل", "شحن", "delivery", "يوصل", "كم يوم", "متى يوصل"],
    reply: "🚚 خدمة التوصيل:\n\n📍 داخل طرابلس: 1-2 يوم\n📍 خارج طرابلس: 2-4 أيام\n📍 جميع مدن ليبيا: متوفر\n\n💰 رسوم التوصيل: حسب المنطقة\n\n✅ الدفع عند الاستلام متاح!",
    buttons: [
      { label: "🛒 اطلب الآن", value: "رابط_المتجر" },
      { label: "📞 تواصل معنا", value: "تواصل" },
    ],
  },
  {
    keywords: ["تواصل", "رقم", "هاتف", "واتساب", "واتس", "whatsapp", "اتصال", "تلفون"],
    reply: "📞 تقدرين تتواصلين معنا عبر:\n\n📱 واتساب: +218 93-5364926\n📞 هاتف: +218 93-5364926\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\nأو أرسلي طلبك هنا وبنرد عليكِ! 💌",
    buttons: [
      { label: "📱 واتساب مباشر", value: "واتساب_مباشر" },
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    keywords: ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود"],
    reply: "🎉 عروضنا الحالية:\n\n🔥 خصم 15% على الحقائب\n🔥 اشتري 2 واحصلي على الثالث مجاناً\n🔥 توصيل مجاني للطلبات فوق 200 د.ل\n\nسارعي قبل انتهاء العرض! ⏰",
    buttons: [
      { label: "🛒 تسوقي الآن", value: "رابط_المتجر" },
    ],
  },
  {
    keywords: ["ارجاع", "استرجاع", "تبديل", "استبدال", "ضمان", "مرتجع"],
    reply: "🔄 سياسة الاستبدال والإرجاع:\n\n✅ استبدال خلال 3 أيام من الاستلام\n✅ المنتج لازم يكون بحالته الأصلية\n✅ مع الفاتورة والتغليف\n\n📞 تواصلي معنا لترتيب الاستبدال",
    buttons: [
      { label: "📱 واتساب", value: "واتساب_مباشر" },
      { label: "📞 اتصال", value: "اتصال_مباشر" },
    ],
  },
  {
    keywords: ["دفع", "فلوس", "كاش", "بطاقة", "تحويل"],
    reply: "💳 طرق الدفع المتاحة:\n\n💵 كاش عند الاستلام\n🏦 تحويل مصرفي\n📱 عبر تطبيقات الدفع المحلية\n\n✅ الدفع عند الاستلام هو الأكثر استخداماً!",
  },
  {
    keywords: ["شكرا", "شكراً", "مشكور", "تسلم", "يعطيك العافية"],
    reply: "العفو حبيبتي! 🌹\nنورتِ متجر هبة الرحمن\n\nتابعينا على حساباتنا:\n📘 فيسبوك\n📸 إنستغرام\n🎵 تيك توك\n\nإذا تحتاجين أي شيء ثاني أنا هنا! 💕",
    buttons: [
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    keywords: ["فيسبوك", "فيس", "facebook", "fb"],
    reply: "📘 تابعينا على فيسبوك وشوفي آخر المنتجات والعروض!\n\nصفحتنا: هبة الرحمن",
    buttons: [
      { label: "📘 زيارة صفحة فيسبوك", value: "فيسبوك_مباشر" },
    ],
  },
  {
    keywords: ["انستغرام", "انستقرام", "instagram", "insta"],
    reply: "📸 تابعينا على إنستغرام لآخر الصيحات والموديلات!\n\nحسابنا: @heba.alrahman.store",
    buttons: [
      { label: "📸 زيارة إنستغرام", value: "انستغرام_مباشر" },
    ],
  },
  {
    keywords: ["تيك توك", "تيكتوك", "tiktok", "تك توك"],
    reply: "🎵 تابعينا على تيك توك لفيديوهات المنتجات!\n\nحسابنا: @haybatalrahman.com0",
    buttons: [
      { label: "🎵 زيارة تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
];

const DEFAULT_REPLY: Message = {
  id: 0,
  text: "عذراً، ما فهمت سؤالكِ 😅\nممكن تسألين بطريقة ثانية؟\n\nأو اختاري من الخيارات:",
  sender: "bot",
  time: "",
  buttons: [
    { label: "🛍️ المنتجات", value: "المنتجات" },
    { label: "💰 الأسعار", value: "الأسعار" },
    { label: "🚚 التوصيل", value: "التوصيل" },
    { label: "📞 تواصل", value: "تواصل" },
  ],
};

function getTime(): string {
  return new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(userMessage: string): { text: string; buttons?: QuickButton[] } {
  const msg = userMessage.toLowerCase().trim();

  for (const item of AUTO_REPLIES) {
    for (const keyword of item.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        return { text: item.reply, buttons: item.buttons };
      }
    }
  }

  return { text: DEFAULT_REPLY.text, buttons: DEFAULT_REPLY.buttons };
}

// ====== روابط التواصل الاجتماعي ======
const SOCIAL_LINKS: Record<string, string> = {
  "واتساب_مباشر": "https://wa.me/218935364926",
  "فيسبوك_مباشر": "https://www.facebook.com/share/18gxGwAqoi/?mibextid=wwXIfr",
  "انستغرام_مباشر": "https://www.instagram.com/heba.alrahman.store",
  "تيكتوك_مباشر": "https://www.tiktok.com/@haybatalrahman.com0",
  "اتصال_مباشر": "tel:+218935364926",
  "رابط_المتجر": "/shop",
};

export default function AutoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "أهلاً بكِ في متجر هبة الرحمن! 🌸\nأنا المساعدة الذكية، كيف أقدر أخدمكِ؟",
      sender: "bot",
      time: getTime(),
      buttons: [
        { label: "🛍️ تصفح المنتجات", value: "المنتجات" },
        { label: "💰 الأسعار", value: "الأسعار" },
        { label: "🚚 التوصيل", value: "التوصيل" },
        { label: "📞 تواصل معنا", value: "تواصل" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // لو ضغط زر رابط مباشر — افتح الرابط
    if (SOCIAL_LINKS[messageText]) {
      const link = SOCIAL_LINKS[messageText];
      if (link.startsWith("/")) {
        window.location.href = link;
      } else {
        window.open(link, "_blank");
      }
      return;
    }

    const userMsg: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getBotReply(messageText);

      const botMsg: Message = {
        id: Date.now() + 1,
        text: reply.text,
        sender: "bot",
        time: getTime(),
        buttons: reply.buttons,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ====== فقاعة الشات ====== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => { setIsOpen(true); setUnread(0); }}
            className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-gradient-to-br from-luxury-beige to-amber-600 
                       rounded-full shadow-2xl shadow-luxury-beige/30 flex items-center justify-center
                       hover:shadow-luxury-beige/50 transition-shadow"
          >
            <MessageCircle className="w-7 h-7 text-dark-900" />

            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full 
                           text-white text-xs font-bold flex items-center justify-center"
              >
                {unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== نافذة الشات ====== */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[95] w-[380px] max-w-[calc(100vw-2rem)] 
                       h-[550px] max-h-[calc(100vh-3rem)]
                       bg-dark-900 border border-luxury-beige/20 rounded-3xl shadow-2xl 
                       flex flex-col overflow-hidden"
          >
            {/* الهيدر */}
            <div className="bg-gradient-to-r from-luxury-beige/20 to-amber-900/20 
                            border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-luxury-beige to-amber-600 
                                rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-dark-900" />
                </div>
                <div>
                  <h3 className="text-luxury-cream font-bold text-sm">مساعدة هبة الرحمن</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-[10px]">متصلة الآن</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 
                           text-white/50 hover:text-red-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                    ${msg.sender === "bot"
                      ? "bg-gradient-to-br from-luxury-beige to-amber-600"
                      : "bg-white/10"}`}
                  >
                    {msg.sender === "bot"
                      ? <Bot className="w-4 h-4 text-dark-900" />
                      : <User className="w-4 h-4 text-white/60" />}
                  </div>

                  <div className={`max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                      ${msg.sender === "bot"
                        ? "bg-white/5 text-luxury-cream rounded-tl-sm border border-white/5"
                        : "bg-gradient-to-r from-luxury-beige to-amber-600 text-dark-900 rounded-tr-sm font-medium"}`}
                    >
                      {msg.text}
                    </div>

                    {msg.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.buttons.map((btn, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(btn.value)}
                            className="px-3 py-1.5 text-[11px] rounded-full border border-luxury-beige/30 
                                       text-luxury-beige hover:bg-luxury-beige hover:text-dark-900 
                                       transition-all whitespace-nowrap"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[10px] text-white/20 mt-1 px-1">{msg.time}</span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2 items-center"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-luxury-beige to-amber-600 
                                  flex items-center justify-center">
                    <Bot className="w-4 h-4 text-dark-900" />
                  </div>
                  <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-luxury-beige/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-luxury-beige/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-luxury-beige/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* حقل الإدخال */}
            <div className="p-3 border-t border-white/5 bg-dark-800/50">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                <input
                  type="text"
                  placeholder="اكتبي رسالتكِ..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-luxury-cream 
                             placeholder:text-white/20 text-right"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-luxury-beige to-amber-600 
                             text-dark-900 disabled:opacity-30 disabled:cursor-not-allowed
                             hover:shadow-lg hover:shadow-luxury-beige/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <p className="text-center text-[9px] text-white/15 mt-2">
                مساعدة ذكية • متجر هبة الرحمن
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}