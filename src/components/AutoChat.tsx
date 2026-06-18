"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, CheckCheck } from "lucide-react";
import Link from "next/link";

// 👇 هنا تضيف كل الردود التلقائية، تعدلها او تضيف عليها كما تريد
const autoReplies = [
  {
    keywords: ["مرحبا", "السلام", "هلا", "اهلا", "مساء الخير", "صباح الخير"],
    reply: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🤍 كيف أقدر أساعدك اليوم؟"
  },
  {
    keywords: ["طلب", "اطلب", "كيف اطلب", "طريقة الطلب", "شراء"],
    reply: "يسرنا ذلك! 🛍️ يمكنك الطلب بسهولة عن طريق:\n1. اختيار المنتج الذي تعجبينه\n2. الضغط على اضافة للسلة\n3. اكمال بيانات التوصيل في صفحة الدفع\nاو راسلينا على الواتساب وسنطلب منكِ مباشرة!"
  },
  {
    keywords: ["توصيل", "شحن", "توصيل كم", "كم يوصل", "مدة التوصيل"],
    reply: "🚚 خدمة التوصيل متوفرة لجميع المحافظات:\n• داخل العاصمة: التوصيل خلال 24 ساعة بسعر 5 د.ل\n• للمحافظات الاخرى: التوصيل خلال 2-3 ايام بسعر 8 د.ل\nالدفع عند الاستلام في كل المناطق!"
  },
  {
    keywords: ["استرجاع", "ارجاع", "بدل", "مشكلة في المنتج"],
    reply: "✅ نضمن لكِ كل منتجاتنا!\nيمكنك استرجاع او استبدال المنتج خلال 3 ايام من الاستلام في حال كان فيه عيب مصنعي."
  },
  {
    keywords: ["سعر", "اسعار", "بكم", "كم سعر", "ثمن"],
    reply: "💰 اسعارنا موجودة تحت كل منتج في صفحة المتجر، ويمكنك تصفح كل المنتجات من قسم 'المتجر'! اذا كنتِ تسألين عن منتج معين اكتبي اسمه وسأعطيكِ السعر فوراً."
  },
  {
    keywords: ["ساعة", "ساعات", "orsga"],
    reply: "⌚ ساعاتنا النسائية الفاخرة الاصلية بسعر 125 د.ل، مع ضمان سنة كاملة على الماكينة، متوفرة بعدة ألوان!"
  },
  {
    keywords: ["عطر", "عطور", "برفان"],
    reply: "🌸 عطورنا ثابتة درجة اولى، اسعارها تبدا من 35 د.ل، متوفرة بكل الروائح العربية والعالمية."
  },
  {
    keywords: ["حقيبة", "حقائب", "شنطة"],
    reply: "👜 حقائبنا جلد طبيعي ومقاوم، اسعارها تبدا من 80 د.ل، موديلات جديدة كل اسبوع."
  },
  {
    keywords: ["وقت", "ساعات العمل", "متى تفتحون", "دوام"],
    reply: "⏰ نستقبل طلباتكم على مدار 24 ساعة طوال ايام الاسبوع، والتوصيل من الساعة 9 صباحاً حتى 9 مساءً."
  },
  {
    keywords: ["واتساب", "اتصال", "تواصل", "رقم"],
    reply: "📱 يمكنك التواصل معنا مباشرة على الواتساب بالضغط هنا: https://wa.me/ضع_رقم_الواتساب_هنا"
  }
]

// الاسئلة السريعة الجاهزة
const quickQuestions = [
  "كم مدة التوصيل؟",
  "كيف اطلب؟",
  "هل يوجد استرجاع؟",
  "تواصل على واتساب"
]

interface Message {
  text: string;
  sender: "user" | "bot";
  time: string;
}

export default function AutoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "أهلاً بكِ في متجر هبة الرحمن! ✨ كيف أقدر أساعدك اليوم؟",
      sender: "bot",
      time: new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // سكرول تلقائي لاخر رسالة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // دالة ايجاد الرد المناسب
  const getBotReply = (userMessage: string) => {
    const msg = userMessage.toLowerCase();
    
    // نبحث عن كلمة مفتاحية في الرسالة
    for (const item of autoReplies) {
      for (const keyword of item.keywords) {
        if (msg.includes(keyword.toLowerCase())) {
          return item.reply;
        }
      }
    }

    // اذا ما وجدنا رد:
    return "اعتذر ما عندي اجابة دقيقة على سؤالك! 🤍 يمكنك التواصل معنا مباشرة على الواتساب وسنرد عليك فوراً: https://wa.me/ضع_رقم_الواتساب_هنا";
  }

  // ارسال الرسالة
  const sendMessage = (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // اضف رسالة المستخدم
    const newUserMessage: Message = {
      text: messageText,
      sender: "user",
      time: new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" })
    }

    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    // محاكاة وقت الكتابة
    setTimeout(() => {
      const botReply: Message = {
        text: getBotReply(messageText),
        sender: "bot",
        time: new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" })
      }
      setMessages(prev => [...prev, botReply]);
      setIsTyping(false);
    }, 1200);
  }

  return (
    <>
      {/* زر الفتح العائم */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[99] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center gold-gradient-bg text-dark-900"
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </AnimatePresence>
      </motion.button>

      {/* نافذة الشات */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[99] w-[90%] max-w-sm h-[500px] bg-dark-900 border border-luxury-beige/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* الهيدر */}
            <div className="p-4 border-b border-white/5 bg-dark-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-dark-900 font-bold">
                هـ
              </div>
              <div>
                <h4 className="text-luxury-cream font-bold">خدمة العملاء</h4>
                <p className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span>
                  متصل الان
                </p>
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#050505]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl ${
                    msg.sender === "user" 
                    ? "bg-white/5 text-luxury-cream rounded-tr-none" 
                    : "bg-luxury-beige/10 text-luxury-cream border border-luxury-beige/20 rounded-tl-none"
                  }`}>
                    <p className="text-sm whitespace-pre-line leading-relaxed">
                      {/* نحول روابط الواتساب لروابط قابلة للضغط */}
                      {msg.text.includes("https://wa.me") ? (
                        <>
                          {msg.text.split("https://wa.me/")[0]}
                          <Link href={`https://wa.me/${msg.text.split("https://wa.me/")[1]}`} target="_blank" className="text-luxury-beige underline">
                            اضغط هنا للتواصل واتساب
                          </Link>
                        </>
                      ) : msg.text}
                    </p>
                    <p className={`text-[10px] mt-1 flex items-center gap-1 ${msg.sender === "user" ? "text-white/40" : "text-luxury-beige/60 justify-end"}`}>
                      {msg.time}
                      {msg.sender === "user" && <CheckCheck size={12} />}
                    </p>
                  </div>
                </div>
              ))}

              {/* مؤشر الكتابة */}
              {isTyping && (
                <div className="flex justify-end">
                  <div className="bg-luxury-beige/10 p-3 rounded-2xl rounded-tl-none border border-luxury-beige/20">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-luxury-beige/40 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-luxury-beige/40 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="w-2 h-2 rounded-full bg-luxury-beige/40 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* الاسئلة السريعة */}
            <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5 no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 whitespace-nowrap rounded-full bg-white/5 text-luxury-beige/80 hover:bg-luxury-beige/20 transition-all shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* حقل الكتابة */}
            <div className="p-3 border-t border-white/5 bg-dark-800 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 bg-white/5 rounded-full px-4 py-3 text-sm text-luxury-cream outline-none border border-transparent focus:border-luxury-beige/20"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-dark-900 disabled:opacity-50 transition-opacity"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}