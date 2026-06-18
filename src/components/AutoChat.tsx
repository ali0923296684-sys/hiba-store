"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

// ====== روابط التواصل ======
const SOCIAL_LINKS: Record<string, string> = {
  "واتساب_مباشر": "https://wa.me/218935364926",
  "فيسبوك_مباشر": "https://www.facebook.com/share/18gxGwAqoi/?mibextid=wwXIfr",
  "انستغرام_مباشر": "https://www.instagram.com/heba.alrahman.store",
  "تيكتوك_مباشر": "https://www.tiktok.com/@haybatalrahman.com0",
  "اتصال_مباشر": "tel:+218935364926",
  "رابط_المتجر": "/shop",
};

// ====== 120 سؤال وجواب ======
const QA_DATABASE: { keywords: string[]; reply: string; buttons?: QuickButton[] }[] = [
  // ===== التحيات =====
  {
    keywords: ["سلام", "هلا", "مرحبا", "هاي", "السلام", "اهلا", "أهلا", "مساء الخير", "صباح الخير"],
    reply: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أساعدكِ اليوم؟",
    buttons: [
      { label: "🛍️ تصفح المنتجات", value: "المنتجات" },
      { label: "💰 الأسعار", value: "الأسعار" },
      { label: "🚚 التوصيل", value: "التوصيل" },
      { label: "📞 تواصل معنا", value: "تواصل" },
      { label: "🏷️ العروض والخصومات", value: "عروض" },
    ],
  },

  // ===== الطلب والشراء (1-5) =====
  {
    keywords: ["كيف اطلب", "طريقة الطلب", "كيف يمكنني الطلب", "كيف أبدأ", "كيف ابدا الشراء", "كيف أبدأ التسوق"],
    reply: "يمكنكِ إتمام طلبك بسهولة عبر:\n\n1️⃣ تصفحي المنتجات في المتجر\n2️⃣ أضيفي المنتج للسلة\n3️⃣ أكملي بيانات التوصيل\n\nأو راسلينا على واتساب: +218 93-536-4926 📱",
    buttons: [
      { label: "🛒 زيارة المتجر", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    keywords: ["شراء", "اشتري", "طلب", "اطلب"],
    reply: "🛍️ يسعدنا خدمتكِ! اختاري المنتج اللي يعجبكِ من المتجر وأضيفيه للسلة، أو راسلينا واحنا نساعدك!",
    buttons: [
      { label: "🛒 المتجر", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    keywords: ["عدة منتجات", "أكثر من منتج", "طلب واحد"],
    reply: "نعم بكل تأكيد! ✅ تقدرين تشترين عدة منتجات في طلب واحد بدون أي مشكلة.",
  },
  {
    keywords: ["حد أدنى", "حد ادنى", "أقل طلب"],
    reply: "لا يوجد حد أدنى لمعظم المنتجات 🎉 اطلبي اللي يعجبك!",
  },
  {
    keywords: ["حجز", "احجز", "حجز منتج"],
    reply: "نعم يمكنكِ حجز المنتج حسب الكمية المتاحة ✅ راسلينا وسنحجزه لكِ!",
    buttons: [{ label: "📱 واتساب للحجز", value: "واتساب_مباشر" }],
  },

  // ===== التوصيل والشحن (6-12) =====
  {
    keywords: ["توصيل", "شحن", "delivery", "يوصل", "التوصيل متوفر", "هل التوصيل"],
    reply: "نعم! 🚚 نوفر خدمة التوصيل إلى مختلف المدن والمناطق في ليبيا.\n\n📍 داخل طرابلس: 1-2 يوم\n📍 خارج طرابلس: 2-5 أيام\n\n✅ الدفع عند الاستلام متاح!",
    buttons: [
      { label: "💰 تكلفة التوصيل", value: "تكلفة التوصيل" },
      { label: "🛒 اطلبي الآن", value: "رابط_المتجر" },
    ],
  },
  {
    keywords: ["كم يوم", "مدة التوصيل", "متى يوصل", "كم تستغرق", "تاخر", "تأخر"],
    reply: "🚚 مدة التوصيل:\n\n📍 داخل طرابلس: 1-2 يوم عمل\n📍 خارج طرابلس: 2-5 أيام عمل\n\nإذا تأخر طلبك تواصلي معنا وسنتابع الأمر فوراً! 📞",
    buttons: [{ label: "📱 تواصل معنا", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تكلفة التوصيل", "رسوم التوصيل", "سعر التوصيل", "كم التوصيل", "تكلفة الشحن"],
    reply: "💰 تكلفة التوصيل تختلف حسب المدينة. بعد تحديد مدينتكِ سنخبرك بالتكلفة الدقيقة.\n\n🎉 توصيل مجاني للطلبات الكبيرة!",
    buttons: [{ label: "📱 اسألي عن مدينتك", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تشمل التوصيل", "الاسعار تشمل", "الأسعار تشمل"],
    reply: "💰 يتم احتساب رسوم التوصيل حسب موقع العميل وتُضاف عند إتمام الطلب.",
  },
  {
    keywords: ["خارج ليبيا", "شحن دولي", "خارج البلاد"],
    reply: "🌍 يرجى التواصل معنا لمعرفة الدول المتاحة للشحن الدولي.",
    buttons: [{ label: "📱 تواصل معنا", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["استلام شخصي", "استلم بنفسي"],
    reply: "📦 نعم! حسب المنطقة وتوفر الخدمة يمكنكِ الاستلام شخصياً.",
    buttons: [{ label: "📱 تنسيق الاستلام", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تغيير عنوان", "تعديل العنوان", "عنوان التوصيل"],
    reply: "✅ نعم يمكنكِ تغيير عنوان التوصيل قبل إرسال الطلب. راسلينا فوراً!",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["موعد التوصيل", "تحديد موعد"],
    reply: "📅 يمكن تحديد موعد تقريبي حسب شركة الشحن والمنطقة.",
  },
  {
    keywords: ["شحن سريع", "توصيل سريع"],
    reply: "⚡ نعم! حسب المنطقة وشركة التوصيل يمكن توفير شحن سريع.",
  },

  // ===== الدفع (13-17) =====
  {
    keywords: ["دفع", "طرق الدفع", "كيف ادفع", "فلوس", "كاش", "بطاقة", "تحويل"],
    reply: "💳 طرق الدفع المتاحة:\n\n💵 كاش عند الاستلام (الأكثر استخداماً)\n🏦 تحويل مصرفي\n📱 عبر تطبيقات الدفع المحلية\n\n✅ الدفع عند الاستلام متاح لجميع المناطق!",
  },
  {
    keywords: ["دفع مسبق", "ادفع مسبقا"],
    reply: "✅ نعم يمكن الدفع مسبقاً حسب الاتفاق.",
  },
  {
    keywords: ["الموقع آمن", "آمن للدفع", "امان الدفع"],
    reply: "🔒 نعم! نستخدم وسائل آمنة قدر الإمكان لحماية بياناتكِ.",
  },
  {
    keywords: ["فاتورة", "فواتير"],
    reply: "🧾 نعم نوفر فواتير عند الطلب.",
  },
  {
    keywords: ["ضرائب", "ضريبة"],
    reply: "💰 الأسعار حسب القوانين المعمول بها.",
  },

  // ===== المنتجات (18-30) =====
  {
    keywords: ["المنتجات", "منتجات", "شنو عندكم", "ايش عندكم", "تبيعون", "أصناف", "منتجات مميزة"],
    reply: "عندنا تشكيلة فخمة تشمل:\n\n👜 حقائب فاخرة\n⌚ ساعات أنيقة\n🧴 عطور مميزة\n💍 إكسسوارات\n👗 ملابس نسائية\n👠 أحذية فاخرة\n\nتقدرين تتصفحين كل المنتجات من المتجر! 🛍️",
    buttons: [
      { label: "🛒 زيارة المتجر", value: "رابط_المتجر" },
      { label: "💰 الأسعار", value: "الأسعار" },
    ],
  },
  {
    keywords: ["أصلية", "اصلية", "اصليه", "جودة", "مضمونة"],
    reply: "✅ نعم! نحرص على توفير منتجات عالية الجودة ومضمونة. الجودة من أولوياتنا! 💎",
  },
  {
    keywords: ["مطابقة للصور", "الصور حقيقية", "صور حقيقيه"],
    reply: "✅ نعم! الصور تعبر عن المنتج بدقة عالية. نسعى لعرض صور دقيقة للمنتجات.",
  },
  {
    keywords: ["متوفر", "توفر المنتج", "موجود", "متاح"],
    reply: "📦 راسلينا باسم المنتج وسنخبرك بالتوفر فوراً!",
    buttons: [{ label: "📱 اسألي عن التوفر", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["جديدة", "منتجات جديدة", "جديد"],
    reply: "✨ نعم! نقوم بإضافة منتجات جديدة بشكل مستمر. تابعينا لتشوفي آخر الوصولات!",
    buttons: [
      { label: "🛒 المتجر", value: "رابط_المتجر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
    ],
  },
  {
    keywords: ["حصرية", "حصري"],
    reply: "💎 نعم! نوفر منتجات مميزة وحصرية ما تلاقينها في أي مكان ثاني!",
  },
  {
    keywords: ["استخدام يومي", "يومي"],
    reply: "✅ نعم! معظم منتجاتنا مناسبة للاستخدام اليومي حسب نوع المنتج.",
  },
  {
    keywords: ["لون", "ألوان", "الوان", "مقاس", "مقاسات"],
    reply: "🎨 نعم! إذا كان المنتج متوفر بعدة ألوان أو مقاسات ستجدينها في صفحة المنتج. أو اسألينا!",
    buttons: [{ label: "📱 اسألي عن الألوان", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["منتج غير موجود", "منتج مش موجود", "غير متوفر", "مش متوفر"],
    reply: "🔍 يمكننا محاولة توفيره حسب الإمكانية! راسلينا باللي تبين وسنحاول نوفره.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["منتج مخصص", "تفصيل"],
    reply: "✂️ يرجى التواصل معنا لمعرفة إمكانية توفير منتجات مخصصة.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تفاصيل المنتج", "معلومات عن"],
    reply: "📋 بكل سرور! أرسلي اسم المنتج وسنوفر لكِ جميع التفاصيل.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["مقارنة", "قارن"],
    reply: "⚖️ يمكنكِ مقارنة المنتجات في المتجر! أو اسألينا وسنساعدك بالاختيار.",
  },
  {
    keywords: ["اختار", "اختيار", "المناسب", "تنصحوني"],
    reply: "💝 فريقنا جاهز لمساعدتك واختيار الأفضل! قوليلنا شنو تبين وسننصحك.",
    buttons: [{ label: "📱 واتساب للمساعدة", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["مخزون", "المخزون"],
    reply: "📦 نعم! يتم تحديث المخزون بشكل دوري تلقائياً.",
  },
  {
    keywords: ["موسمية", "موسم"],
    reply: "🌸 نعم! عندنا منتجات موسمية حسب الموسم والمناسبات.",
  },

  // ===== الأسعار والعروض (31-40) =====
  {
    keywords: ["السعر", "الأسعار", "الاسعار", "كم سعر", "بكم", "ثمن", "غالي", "رخيص", "سعر"],
    reply: "💰 أسعارنا موجودة تحت كل منتج في صفحة المتجر.\n\nأسعارنا تبدأ من 25 د.ل 💎\n\nوعندنا عروض وخصومات دائمة! 🎉",
    buttons: [
      { label: "🛒 تصفحي الأسعار", value: "رابط_المتجر" },
      { label: "🏷️ العروض", value: "عروض" },
    ],
  },
  {
    keywords: ["محدثة", "اسعار محدثة"],
    reply: "✅ نعم! الأسعار يتم تحديثها باستمرار.",
  },
  {
    keywords: ["منافسة", "اسعار منافسة"],
    reply: "💪 نعم! نسعى لتقديم أفضل قيمة بأسعار منافسة.",
  },
  {
    keywords: ["تفاوض", "قابلة للتفاوض"],
    reply: "🤝 بعض المنتجات والعروض قد تكون قابلة للتفاوض. راسلينا!",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود", "خصومات"],
    reply: "⏳ جاري البحث عن العروض المتاحة...",
    buttons: [
      { label: "🛒 تسوقي الآن", value: "رابط_المتجر" },
    ],
  },
  {
    keywords: ["كوبون خصم", "كود خصم", "استخدم كوبون", "كيف استخدم"],
    reply: "🏷️ لاستخدام كوبون الخصم:\n\n1️⃣ أضيفي المنتجات للسلة\n2️⃣ في صفحة الدفع أدخلي الكود\n3️⃣ سيتم خصم النسبة تلقائياً!\n\nاسألينا عن الأكواد المتاحة 😉",
  },
  {
    keywords: ["جمع خصومات", "جمع بين"],
    reply: "📋 حسب شروط العرض - بعض العروض يمكن جمعها وبعضها لا.",
  },
  {
    keywords: ["عملاء دائمين", "ولاء", "برنامج ولاء"],
    reply: "⭐ نعم! نقدم مزايا وعروض خاصة للعملاء الدائمين. كوني من عملائنا المميزين!",
  },
  {
    keywords: ["عروض موسمية", "عروض الأعياد", "عروض الاعياد"],
    reply: "🎊 نعم! عندنا عروض خاصة خلال المناسبات والأعياد. تابعينا!",
    buttons: [
      { label: "📸 تابعينا إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    keywords: ["كمية كبيرة", "جملة", "كميات"],
    reply: "📦 نعم! نوفر طلبات الجملة والتجزئة مع خصومات خاصة للكميات!",
    buttons: [{ label: "📱 واتساب للجملة", value: "واتساب_مباشر" }],
  },

  // ===== ساعات / عطور / حقائب =====
  {
    keywords: ["ساعة", "ساعات", "orsga"],
    reply: "⌚ ساعاتنا النسائية الفاخرة الأصلية بأسعار مميزة!\n\nمع ضمان على الماكينة ✅\nمتوفرة بعدة ألوان 🎨",
    buttons: [{ label: "🛒 شوفي الساعات", value: "رابط_المتجر" }],
  },
  {
    keywords: ["عطر", "عطور", "برفان", "ريحة"],
    reply: "🌸 عطورنا ثابتة درجة أولى!\n\nمتوفرة بكل الروائح العربية والعالمية 💐\nأسعار تبدأ من 35 د.ل",
    buttons: [{ label: "🛒 شوفي العطور", value: "رابط_المتجر" }],
  },
  {
    keywords: ["حقيبة", "حقائب", "شنطة", "شنط"],
    reply: "👜 حقائبنا جلد طبيعي ومقاوم!\n\nموديلات جديدة كل أسبوع 🆕\nأسعار تبدأ من 80 د.ل",
    buttons: [{ label: "🛒 شوفي الحقائب", value: "رابط_المتجر" }],
  },

  // ===== الاستبدال والإرجاع (41-46) =====
  {
    keywords: ["ارجاع", "استرجاع", "تبديل", "استبدال", "ضمان", "مرتجع", "استبدال المقاس"],
    reply: "🔄 سياسة الاستبدال والإرجاع:\n\n✅ استبدال خلال 3 أيام من الاستلام\n✅ المنتج لازم يكون بحالته الأصلية\n✅ مع الفاتورة والتغليف\n\n📞 تواصلي معنا لترتيب الاستبدال",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["منتج تالف", "تالف", "مكسور"],
    reply: "😔 نعتذر عن ذلك! يمكنكِ استبدال المنتج التالف وفق سياسة المتجر. راسلينا فوراً!",
    buttons: [{ label: "📱 واتساب فوراً", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["إلغاء", "الغاء", "الغي", "ألغي"],
    reply: "✅ نعم يمكنكِ إلغاء الطلب قبل شحنه. راسلينا بسرعة!",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تعديل الطلب", "تعديل الكمية", "غير الكمية"],
    reply: "✅ نعم يمكن تعديل الطلب والكمية قبل تجهيزه للشحن.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["فحص", "اختبار", "فحص المنتجات"],
    reply: "✅ نعم! يتم فحص والتأكد من جودة كل منتج قبل الإرسال.",
  },

  // ===== التواصل (47-55) =====
  {
    keywords: ["تواصل", "رقم", "هاتف", "واتساب", "واتس", "whatsapp", "اتصال", "تلفون", "خدمة العملاء"],
    reply: "📞 تقدرين تتواصلين معنا عبر:\n\n📱 واتساب: +218 93-536-4926\n📞 هاتف: +218 93-536-4926\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\nأو أرسلي طلبك هنا وبنرد عليكِ! 💌",
    buttons: [
      { label: "📱 واتساب مباشر", value: "واتساب_مباشر" },
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    keywords: ["ساعات العمل", "متى تفتحون", "دوام", "أوقات", "اوقات"],
    reply: "⏰ نستقبل طلباتكم على مدار الساعة!\n\nوالتوصيل من 9 صباحاً حتى 9 مساءً 📦",
  },
  {
    keywords: ["يتم الرد", "سرعة الرد", "كم يأخذ الرد"],
    reply: "⚡ نسعى للرد بأسرع وقت ممكن! عادةً خلال دقائق على الواتساب.",
  },
  {
    keywords: ["مشكلة", "شكوى", "أبلغ", "ابلغ"],
    reply: "😔 نعتذر عن أي إزعاج! تواصلي معنا مباشرة وسنحل المشكلة فوراً.",
    buttons: [{ label: "📱 واتساب فوراً", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["الإدارة", "الادارة"],
    reply: "📋 يمكنكِ التواصل مع الإدارة عبر قنوات التواصل الرسمية.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["دعم فني", "دعم"],
    reply: "🛠️ نعم! فريق الدعم جاهز للمساعدة في أي وقت.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["اقتراح", "اقترح"],
    reply: "💡 نرحب دائماً باقتراحات عملائنا! أرسلي اقتراحك وسنأخذه بعين الاعتبار.",
  },
  {
    keywords: ["تعاون", "شراكة"],
    reply: "🤝 يسعدنا دراسة فرص التعاون! راسلينا بالتفاصيل.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },

  // ===== حسابات التواصل =====
  {
    keywords: ["فيسبوك", "فيس", "facebook", "fb"],
    reply: "📘 تابعينا على فيسبوك لآخر المنتجات والعروض!",
    buttons: [{ label: "📘 زيارة فيسبوك", value: "فيسبوك_مباشر" }],
  },
  {
    keywords: ["انستغرام", "انستقرام", "instagram", "insta"],
    reply: "📸 تابعينا على إنستغرام لآخر الصيحات!\n\nحسابنا: @heba.alrahman.store",
    buttons: [{ label: "📸 زيارة إنستغرام", value: "انستغرام_مباشر" }],
  },
  {
    keywords: ["تيك توك", "تيكتوك", "tiktok"],
    reply: "🎵 تابعينا على تيك توك لفيديوهات المنتجات!\n\nحسابنا: @haybatalrahman.com0",
    buttons: [{ label: "🎵 زيارة تيك توك", value: "تيكتوك_مباشر" }],
  },

  // ===== عن المتجر (56-65) =====
  {
    keywords: ["من نحن", "من انتم", "ما هو", "هبة الرحمن"],
    reply: "🌟 هبة الرحمن متجر إلكتروني يهدف إلى تقديم منتجات مميزة وخدمة موثوقة.\n\nنتميز بـ:\n✅ الجودة العالية\n✅ المصداقية\n✅ الخدمة الممتازة\n✅ الأسعار المناسبة",
  },
  {
    keywords: ["لماذا", "ليش اختار", "ما يميز"],
    reply: "💎 ما يميز هبة الرحمن:\n\n✅ الجودة والمصداقية\n✅ خدمة ممتازة قبل وبعد البيع\n✅ أسعار مناسبة\n✅ توصيل لكل مدن ليبيا\n✅ منتجات حصرية ومميزة",
  },
  {
    keywords: ["أين يقع", "اين يقع", "موقعكم", "فين"],
    reply: "📍 نعمل عبر الإنترنت لخدمة العملاء في مختلف المناطق.\n\n🇱🇾 ليبيا - طرابلس",
  },
  {
    keywords: ["متجر فعلي", "محل"],
    reply: "🏪 يرجى التواصل معنا لمعرفة أحدث التفاصيل.",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["الموقع", "موقع الكتروني", "رابط الموقع"],
    reply: "🌐 نعم! موقعنا الإلكتروني: hibatrahman.xyz\n\nيمكنكِ التسوق مباشرة من الموقع!",
    buttons: [{ label: "🛒 زيارة المتجر", value: "رابط_المتجر" }],
  },
  {
    keywords: ["الهاتف", "يعمل على الهاتف", "موبايل", "جوال"],
    reply: "📱 نعم! الموقع متوافق مع الهواتف وسهل الاستخدام.",
  },
  {
    keywords: ["بيانات آمنة", "خصوصية", "بياناتي"],
    reply: "🔒 نعم! نحافظ على خصوصية وأمان بيانات العملاء بالكامل.",
  },

  // ===== متابعة الطلب (66-72) =====
  {
    keywords: ["حالة طلبي", "تتبع", "متابعة", "وين طلبي", "وصل"],
    reply: "📦 لمتابعة طلبكِ:\n\n1️⃣ ادخلي صفحة تتبع الطلب\n2️⃣ أدخلي رقم الطلب\n\nأو راسلينا برقم الطلب وسنزودك بالتفاصيل!",
    buttons: [
      { label: "📦 تتبع الطلب", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    keywords: ["إشعارات", "اشعارات"],
    reply: "🔔 نعم! عند توفر النظام سيتم إرسال إشعارات بحالة طلبكِ.",
  },

  // ===== هدايا (73-78) =====
  {
    keywords: ["هدية", "إهداء", "اهداء", "هدايا"],
    reply: "🎁 بكل سرور! يمكنكِ:\n\n✅ شراء هدية وإرسالها مباشرة لشخص آخر\n✅ فقط زودينا ببيانات المستلم\n✅ تغليف أنيق متاح حسب توفر الخدمة",
    buttons: [{ label: "📱 ترتيب الهدية", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تغليف", "تغليف هدايا", "تغليف أنيق"],
    reply: "🎀 نعم! تغليف أنيق للهدايا متاح حسب توفر الخدمة.",
  },

  // ===== التقييمات والمراجعات =====
  {
    keywords: ["تقييم", "مراجعة", "رأي"],
    reply: "⭐ نرحب بآراء وتقييمات عملائنا! يمكنكِ التقييم بعد الشراء.",
  },
  {
    keywords: ["تقييمات حقيقية"],
    reply: "✅ نعم! نعرض تقييمات العملاء الفعلية بكل شفافية.",
  },

  // ===== مشاركة ومفضلة =====
  {
    keywords: ["مشاركة", "شارك"],
    reply: "📤 نعم! يمكنكِ مشاركة المنتجات عبر وسائل التواصل الاجتماعي.",
  },
  {
    keywords: ["مفضلة", "حفظ"],
    reply: "❤️ نعم! يمكنكِ حفظ المنتجات المفضلة عند تسجيل الدخول.",
  },

  // ===== كلمة المرور والحساب =====
  {
    keywords: ["تسجيل", "حساب", "تسجيل مجاني"],
    reply: "✅ نعم! التسجيل مجاني بالكامل.",
  },
  {
    keywords: ["كلمة المرور", "نسيت كلمة"],
    reply: "🔑 يمكنكِ تغيير كلمة المرور من إعدادات الحساب، أو استخدمي خيار 'نسيت كلمة المرور'.",
  },
  {
    keywords: ["بدون حساب", "بدون تسجيل"],
    reply: "🛒 حسب إعدادات الموقع - يمكنكِ التسوق والطلب عبر واتساب بدون حساب!",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    keywords: ["تعديل بياناتي", "تغيير بياناتي"],
    reply: "✅ نعم يمكنكِ تعديل بياناتكِ من حسابك الشخصي.",
  },

  // ===== خدمة ما بعد البيع =====
  {
    keywords: ["بعد البيع", "ما بعد البيع", "بعد الشراء"],
    reply: "🤝 نعم! نقدم خدمة ما بعد البيع. رضا العميل من أولوياتنا!\n\nنحن هنا لخدمتكِ قبل وبعد الشراء 💕",
  },

  // ===== الشكر =====
  {
    keywords: ["شكرا", "شكراً", "مشكور", "تسلم", "يعطيك العافية", "ممتنة"],
    reply: "العفو حبيبتي! 🌹\nنورتِ متجر هبة الرحمن\n\nتابعينا على حساباتنا:\n📘 فيسبوك | 📸 إنستغرام | 🎵 تيك توك\n\nإذا تحتاجين أي شيء ثاني أنا هنا! 💕",
    buttons: [
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
];

const DEFAULT_REPLY = {
  text: "عذراً ما عندي إجابة دقيقة على سؤالكِ 🤍\n\nيمكنكِ التواصل معنا مباشرة وسنرد عليكِ فوراً!",
  buttons: [
    { label: "📱 واتساب مباشر", value: "واتساب_مباشر" },
    { label: "🛍️ المنتجات", value: "المنتجات" },
    { label: "💰 الأسعار", value: "الأسعار" },
    { label: "🚚 التوصيل", value: "التوصيل" },
  ] as QuickButton[],
};

function getTime(): string {
  return new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(userMessage: string): { text: string; buttons?: QuickButton[] } {
  const msg = userMessage.toLowerCase().trim();

  for (const item of QA_DATABASE) {
    for (const keyword of item.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        return { text: item.reply, buttons: item.buttons };
      }
    }
  }

  return { text: DEFAULT_REPLY.text, buttons: DEFAULT_REPLY.buttons };
}

export default function AutoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nأنا المساعدة الذكية، كيف أقدر أخدمكِ؟",
      sender: "bot",
      time: getTime(),
      buttons: [
        { label: "🛍️ تصفح المنتجات", value: "المنتجات" },
        { label: "💰 الأسعار", value: "الأسعار" },
        { label: "🚚 التوصيل", value: "التوصيل" },
        { label: "🏷️ العروض", value: "عروض" },
        { label: "📞 تواصل معنا", value: "تواصل" },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ====== جلب العروض الحقيقية من Supabase ======
  const fetchRealOffers = async (): Promise<string> => {
    try {
      const { data: promos } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("is_active", true);

      if (promos && promos.length > 0) {
        let text = "🎉 العروض والخصومات المتاحة حالياً:\n\n";
        promos.forEach((p: any, i: number) => {
          text += `🏷️ كود: ${p.code} — خصم ${p.discount_percentage}%\n`;
        });
        text += "\n✅ أدخلي الكود عند إتمام الطلب للحصول على الخصم!";
        return text;
      } else {
        return "😔 لا توجد عروض متاحة حالياً.\n\nلكن تابعينا! عروض جديدة قريباً إن شاء الله 🎉";
      }
    } catch {
      return "🏷️ تابعي صفحتنا لمعرفة آخر العروض والخصومات!";
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    // لو ضغط زر رابط مباشر
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

    // لو سأل عن العروض — جيب من قاعدة البيانات
    const isAskingOffers = ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود", "خصومات"].some(
      (k) => messageText.toLowerCase().includes(k)
    );

    setTimeout(async () => {
      let replyText: string;
      let replyButtons: QuickButton[] | undefined;

      if (isAskingOffers) {
        replyText = await fetchRealOffers();
        replyButtons = [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }];
      } else {
        const reply = getBotReply(messageText);
        replyText = reply.text;
        replyButtons = reply.buttons;
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        text: replyText,
        sender: "bot",
        time: getTime(),
        buttons: replyButtons,
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
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

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
              <button onClick={() => setIsOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 
                    ${msg.sender === "bot" ? "bg-gradient-to-br from-luxury-beige to-amber-600" : "bg-white/10"}`}>
                    {msg.sender === "bot" ? <Bot className="w-4 h-4 text-dark-900" /> : <User className="w-4 h-4 text-white/60" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line
                      ${msg.sender === "bot"
                        ? "bg-white/5 text-luxury-cream rounded-tl-sm border border-white/5"
                        : "bg-gradient-to-r from-luxury-beige to-amber-600 text-dark-900 rounded-tr-sm font-medium"}`}>
                      {msg.text}
                    </div>
                    {msg.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.buttons.map((btn, i) => (
                          <button key={i} onClick={() => handleSend(btn.value)}
                            className="px-3 py-1.5 text-[11px] rounded-full border border-luxury-beige/30 
                                       text-luxury-beige hover:bg-luxury-beige hover:text-dark-900 
                                       transition-all whitespace-nowrap">
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-luxury-beige to-amber-600 flex items-center justify-center">
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

            <div className="p-3 border-t border-white/5 bg-dark-800/50">
              <div className="flex items-center gap-2 bg-white/5 rounded-2xl px-4 py-2 border border-white/10">
                <input type="text" placeholder="اكتبي رسالتكِ..." value={input}
                  onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-luxury-cream placeholder:text-white/20 text-right" />
                <button onClick={() => handleSend()} disabled={!input.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-luxury-beige to-amber-600 
                             text-dark-900 disabled:opacity-30 disabled:cursor-not-allowed
                             hover:shadow-lg hover:shadow-luxury-beige/30 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[9px] text-white/15 mt-2">مساعدة ذكية • متجر هبة الرحمن</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}