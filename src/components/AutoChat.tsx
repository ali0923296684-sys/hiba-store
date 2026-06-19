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

const SOCIAL_LINKS: Record<string, string> = {
  "واتساب_مباشر": "https://wa.me/218935364926",
  "فيسبوك_مباشر": "https://www.facebook.com/share/18gxGwAqoi/?mibextid=wwXIfr",
  "انستغرام_مباشر": "https://www.instagram.com/heba.alrahman.store",
  "تيكتوك_مباشر": "https://www.tiktok.com/@haybatalrahman.com0",
  "اتصال_مباشر": "tel:+218935364926",
  "رابط_المتجر": "/shop",
  "رابط_التتبع": "/track",
  "رابط_المفضلة": "/wishlist",
};

interface Category {
  name: string;
  keywords: string[];
  reply: string;
  buttons?: QuickButton[];
}

const SMART_CATEGORIES: Category[] = [
  {
    name: "تحية",
    keywords: ["سلام", "هلا", "مرحبا", "هاي", "السلام", "اهلا", "أهلا", "مساء الخير", "صباح الخير", "مساء النور", "صباح النور", "كيف الحال", "كيفك", "شخبارك", "شلونك", "اهلين", "يا هلا", "حياك", "الله يحييك", "نهارك سعيد", "مسائك سعيد", "hi", "hello", "hey", "good morning", "good evening", "welcome", "السلام عليكم", "وعليكم السلام", "تحياتي", "مرحبتين"],
    reply: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أساعدكِ اليوم؟\n\nاختاري من الخيارات أو اكتبي سؤالك:",
    buttons: [
      { label: "🛍️ تصفح المنتجات", value: "المنتجات" },
      { label: "💰 الأسعار", value: "الأسعار" },
      { label: "🚚 التوصيل", value: "التوصيل" },
      { label: "🏷️ العروض", value: "عروض" },
      { label: "📞 تواصل معنا", value: "تواصل" },
    ],
  },
  {
    name: "طلب",
    keywords: ["كيف اطلب", "طريقة الطلب", "كيف يمكنني الطلب", "كيف أبدأ", "كيف ابدا", "كيف اشتري", "طريقة الشراء", "عايزة اطلب", "ابي اطلب", "نبي نطلب", "ابغى اطلب", "كيف اسوي طلب", "خطوات الطلب", "اريد طلب", "ابي اشتري", "نبي نشتري", "order", "how to order", "how to buy", "شراء", "اشتري", "طلب", "اطلب", "اريد شراء", "ابغى شراء", "نبي شراء", "عايزة شراء", "كيف الطلب", "طريقة", "اطلب منتج", "اريد منتج", "عايزة منتج", "كيف احصل", "كيف اخذ", "ممكن اطلب", "هل اقدر اطلب", "يمكن اطلب", "تقدر تطلب", "اقدر اطلب", "نقدر نطلب", "ابغي", "ابي", "نبي", "عايز", "عايزة"],
    reply: "يمكنكِ إتمام طلبك بسهولة عبر:\n\n1️⃣ تصفحي المنتجات في المتجر\n2️⃣ أضيفي المنتج للسلة\n3️⃣ أكملي بيانات التوصيل والدفع\n\n📱 أو راسلينا على واتساب: +218 93-536-4926\n\nنوصل لكل مدن ليبيا! 🇱🇾",
    buttons: [
      { label: "🛒 زيارة المتجر", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "توصيل",
    keywords: ["توصيل", "شحن", "delivery", "يوصل", "التوصيل", "هل التوصيل", "كم التوصيل", "مدة التوصيل", "وقت التوصيل", "كم يوم", "متى يوصل", "كم تستغرق", "تاخر", "تأخر", "شحن سريع", "توصيل سريع", "رسوم التوصيل", "تكلفة التوصيل", "سعر التوصيل", "مجاني", "توصيل مجاني", "free delivery", "shipping", "يوصلون", "توصلون", "يوصل لعندي", "كيف يوصل", "طريقة التوصيل", "شركة التوصيل", "مندوب", "سائق", "توصيل لطرابلس", "توصيل لبنغازي", "توصيل لمصراتة", "توصيل لزليتن", "توصيل للزاوية", "توصيل لسبها", "خارج طرابلس", "داخل طرابلس", "كل المدن", "جميع المدن", "مناطق التوصيل", "وين توصلون", "اين توصلون", "هل توصلون", "فين توصلون", "نطاق التوصيل", "تغطية التوصيل", "موعد التوصيل", "تحديد موعد", "استلام", "تسليم", "يوم التوصيل"],
    reply: "🚚 خدمة التوصيل الشاملة:\n\n📍 داخل طرابلس: 1-2 يوم عمل\n📍 بنغازي: 2-3 أيام\n📍 مصراتة: 2-3 أيام\n📍 باقي المدن: 3-5 أيام\n\n💰 رسوم التوصيل حسب المنطقة (تظهر عند الطلب)\n🎉 توصيل مجاني للطلبات الكبيرة!\n✅ الدفع عند الاستلام متاح!\n\nإذا تأخر طلبك راسلينا فوراً 📞",
    buttons: [
      { label: "🛒 اطلبي الآن", value: "رابط_المتجر" },
      { label: "📱 اسألي عن مدينتك", value: "واتساب_مباشر" },
      { label: "📦 تتبع طلب", value: "رابط_التتبع" },
    ],
  },
  {
    name: "سعر",
    keywords: ["السعر", "الأسعار", "الاسعار", "كم سعر", "بكم", "ثمن", "غالي", "رخيص", "سعر", "price", "كم", "تكلفة", "كلفة", "قيمة", "فلوس", "مبلغ", "كم يكلف", "كم تكلف", "كم سعره", "كم سعرها", "بكم هذا", "بكم هذي", "بكم المنتج", "شنو السعر", "ايش السعر", "سعر المنتج", "اسعار المنتجات", "ارخص", "اغلى", "رخيصة", "غالية", "مناسب", "معقول", "اسعار منافسة", "اسعار محدثة", "تفاوض", "قابلة للتفاوض", "خصم على السعر", "تخفيض السعر"],
    reply: "💰 معلومات الأسعار:\n\n✅ الأسعار موجودة تحت كل منتج في المتجر\n✅ يتم تحديثها باستمرار\n✅ أسعار منافسة وعادلة\n\n🏷️ عندنا عروض وخصومات دائمة!\n\nتصفحي المتجر لمعرفة الأسعار 👇",
    buttons: [
      { label: "🛒 تصفحي الأسعار", value: "رابط_المتجر" },
      { label: "🏷️ العروض", value: "عروض" },
      { label: "📱 اسألي عن سعر منتج", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "عروض",
    keywords: ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود", "خصومات", "تنزيلات", "sale", "discount", "offer", "promo", "promotion", "كود خصم", "كوبون خصم", "رمز الخصم", "عرض خاص", "عروض خاصة", "تخفيضات", "اوكازيون", "حسم", "نسبة خصم", "كم الخصم", "فيه خصم", "عندكم خصم", "هل يوجد خصم", "يوجد عرض", "فيه عرض", "عروض اليوم", "عروض الأسبوع", "عروض الشهر", "عروض رمضان", "عروض العيد", "عروض الصيف", "عروض الشتاء", "black friday", "بلاك فرايدي", "كيف استخدم الكود", "كيف ادخل الكود", "وين اكتب الكود", "عملاء دائمين", "ولاء", "برنامج ولاء", "عروض موسمية", "جمع خصومات"],
    reply: "⏳ جاري البحث عن العروض المتاحة...",
    buttons: [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }],
  },
  {
    name: "دفع",
    keywords: ["دفع", "طرق الدفع", "كيف ادفع", "كاش", "بطاقة", "تحويل", "نقد", "فيزا", "ماستركارد", "payment", "pay", "دفع الكتروني", "دفع عند الاستلام", "كاش عند الاستلام", "COD", "تحويل بنكي", "تحويل مصرفي", "حوالة", "صراف", "بنك", "محفظة", "تطبيق دفع", "سداد", "ايداع", "فاتورة", "فواتير", "ضرائب", "ضريبة", "دفع مسبق", "دفع مقدم", "تقسيط", "اقساط", "آمن", "أمان الدفع", "الموقع آمن"],
    reply: "💳 طرق الدفع المتاحة:\n\n💵 كاش عند الاستلام (الأكثر استخداماً ✅)\n🏦 تحويل مصرفي / بنكي\n📱 عبر تطبيقات الدفع المحلية\n💰 دفع مسبق حسب الاتفاق\n\n🔒 جميع المعاملات آمنة\n🧾 فواتير متاحة عند الطلب\n\n✅ الدفع عند الاستلام متاح لجميع مدن ليبيا!",
    buttons: [
      { label: "🛒 اطلبي الآن", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "منتجات",
    keywords: ["المنتجات", "منتجات", "شنو عندكم", "ايش عندكم", "تبيعون", "أصناف", "منتجات مميزة", "شنو تبيعون", "ايش تبيعون", "وش عندكم", "عندكم ايش", "ماذا تبيعون", "ماذا لديكم", "products", "items", "تشكيلة", "مجموعة", "كتالوج", "قائمة المنتجات", "كل المنتجات", "جميع المنتجات", "اصلية", "اصليه", "أصلية", "جودة", "مضمونة", "مطابقة للصور", "صور حقيقية", "حقيقي", "اصلي", "تقليد", "مقلد", "فيرست كوبي", "درجة اولى", "متوفر", "توفر", "موجود", "متاح", "مخزون", "جديدة", "جديد", "حصرية", "حصري", "مميزة", "فاخرة", "فخمة", "راقية", "عالية الجودة"],
    reply: "عندنا تشكيلة فخمة تشمل:\n\n👜 حقائب فاخرة\n⌚ ساعات أنيقة\n🧴 عطور مميزة\n💍 إكسسوارات\n👗 ملابس نسائية\n👠 أحذية فاخرة\n\n✅ جميع منتجاتنا أصلية وعالية الجودة\n✅ الأسعار موجودة في صفحة كل منتج\n✅ منتجات جديدة كل أسبوع!\n\nتصفحي المتجر لمعرفة الأسعار والتفاصيل 👇",
    buttons: [
      { label: "🛒 زيارة المتجر", value: "رابط_المتجر" },
      { label: "❤️ المفضلة", value: "رابط_المفضلة" },
    ],
  },
  {
    name: "ساعات",
    keywords: ["ساعة", "ساعات", "orsga", "watch", "watches", "ساعة يد", "ساعه", "ساعات نسائية", "ساعات رجالية", "ساعة ذهبية", "ساعة فضية", "ماركة الساعة", "ساعة اصلية", "ضمان الساعة", "ساعة فاخرة", "ساعة أنيقة"],
    reply: "⌚ مجموعة الساعات الفاخرة:\n\n✅ ساعات نسائية أصلية\n✅ ضمان على الماكينة\n✅ متوفرة بعدة ألوان (ذهبي، فضي، وردي...)\n✅ تصاميم عصرية وكلاسيكية\n📦 تغليف فاخر مجاني\n\n💰 شوفي الأسعار في المتجر 👇",
    buttons: [{ label: "🛒 شوفي الساعات", value: "رابط_المتجر" }],
  },
  {
    name: "عطور",
    keywords: ["عطر", "عطور", "برفان", "ريحة", "perfume", "fragrance", "رائحة", "عطر نسائي", "عطر رجالي", "عطر ثابت", "عطر درجة اولى", "بخور", "عود", "مسك", "عطر عربي", "عطر فرنسي", "ماركة العطر"],
    reply: "🌸 مجموعة العطور الفاخرة:\n\n✅ عطور ثابتة درجة أولى\n✅ روائح عربية وعالمية\n✅ نسائية ورجالية\n✅ أحجام مختلفة\n🎁 تغليف هدايا متاح\n\n💰 شوفي الأسعار في المتجر 👇",
    buttons: [{ label: "🛒 شوفي العطور", value: "رابط_المتجر" }],
  },
  {
    name: "حقائب",
    keywords: ["حقيبة", "حقائب", "شنطة", "شنط", "bag", "bags", "حقيبة يد", "شنطة يد", "حقيبة جلد", "حقيبة كتف", "حقيبة ظهر", "كلتش", "محفظة", "حقيبة سفر", "حقيبة صغيرة", "حقيبة كبيرة"],
    reply: "👜 مجموعة الحقائب الفاخرة:\n\n✅ جلد طبيعي ومقاوم\n✅ موديلات جديدة كل أسبوع\n✅ أحجام متنوعة (يد، كتف، كلتش...)\n✅ ألوان متعددة\n🆕 تشكيلة متجددة باستمرار\n\n💰 شوفي الأسعار في المتجر 👇",
    buttons: [{ label: "🛒 شوفي الحقائب", value: "رابط_المتجر" }],
  },
  {
    name: "اكسسوارات",
    keywords: ["اكسسوار", "إكسسوار", "اكسسوارات", "إكسسوارات", "مجوهرات", "خاتم", "خواتم", "سلسلة", "سلاسل", "قلادة", "اسوارة", "أسوارة", "سوار", "حلق", "أقراط", "بروش", "دبوس", "خلخال", "تاج", "اطقم", "طقم", "jewelry", "accessories", "نظارة", "نظارات", "شال", "وشاح"],
    reply: "💍 مجموعة الإكسسوارات والمجوهرات:\n\n✅ خواتم، سلاسل، أساور، أقراط\n✅ أطقم كاملة\n✅ نظارات شمسية\n✅ تصاميم عصرية وكلاسيكية\n🎁 مثالية كهدايا!\n\n💰 شوفي الأسعار في المتجر 👇",
    buttons: [{ label: "🛒 شوفي الإكسسوارات", value: "رابط_المتجر" }],
  },
  {
    name: "ارجاع",
    keywords: ["ارجاع", "استرجاع", "تبديل", "استبدال", "ضمان", "مرتجع", "ارجع", "ابدل", "غير", "تالف", "مكسور", "خربان", "معيب", "عيب", "مشكلة بالمنتج", "المنتج مش زين", "المنتج غلط", "مقاس غلط", "لون غلط", "مش اللي طلبته", "return", "exchange", "refund", "استرداد", "فلوسي", "ترجيع الفلوس", "استرداد المبلغ", "سياسة الارجاع", "شروط الارجاع", "كيف ارجع", "ممكن ارجع", "هل اقدر ارجع", "إلغاء", "الغاء", "الغي", "ألغي", "الغي الطلب", "تعديل الطلب", "تعديل الكمية"],
    reply: "🔄 سياسة الاستبدال والإرجاع:\n\n✅ استبدال خلال 3 أيام من الاستلام\n✅ المنتج لازم يكون بحالته الأصلية\n✅ مع الفاتورة والتغليف الأصلي\n✅ إلغاء الطلب ممكن قبل الشحن\n✅ تعديل الطلب/الكمية قبل التجهيز\n\n⚠️ المنتجات التالفة أو المعيبة يتم استبدالها فوراً!\n\n📞 تواصلي معنا لترتيب الاستبدال:",
    buttons: [
      { label: "📱 واتساب فوراً", value: "واتساب_مباشر" },
      { label: "📞 اتصال", value: "اتصال_مباشر" },
    ],
  },
  {
    name: "تواصل",
    keywords: ["تواصل", "رقم", "هاتف", "واتساب", "واتس", "whatsapp", "اتصال", "تلفون", "خدمة العملاء", "رقم الهاتف", "رقم التلفون", "رقم الواتساب", "كيف اتواصل", "وسيلة تواصل", "ارقام", "تليفون", "جوال", "موبايل", "phone", "call", "contact", "ساعات العمل", "متى تفتحون", "دوام", "أوقات", "اوقات", "متى ترد", "سرعة الرد", "كم يأخذ الرد", "ترد", "تردون", "متى تردون", "مشكلة", "شكوى", "أبلغ", "ابلغ", "شكاية", "الإدارة", "الادارة", "المدير", "دعم", "دعم فني", "مساعدة", "help", "support"],
    reply: "📞 قنوات التواصل:\n\n📱 واتساب: +218 93-536-4926\n📞 هاتف: +218 93-536-4926\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\n⏰ نستقبل الطلبات على مدار الساعة!\n⚡ الرد خلال دقائق على الواتساب\n\nأو أرسلي سؤالك هنا مباشرة! 💌",
    buttons: [
      { label: "📱 واتساب مباشر", value: "واتساب_مباشر" },
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    name: "عن المتجر",
    keywords: ["من نحن", "من انتم", "ما هو", "هبة الرحمن", "عن المتجر", "تعريف", "نبذة", "about", "who are you", "لماذا", "ليش اختار", "ما يميز", "شنو يميزكم", "ايش يميزكم", "ليش اشتري منكم", "أين يقع", "اين يقع", "موقعكم", "فين", "عنوان", "عنوانكم", "متجر فعلي", "محل", "فرع", "فروع", "الموقع", "موقع الكتروني", "رابط الموقع", "الهاتف", "يعمل على الهاتف", "موبايل", "جوال", "بيانات آمنة", "خصوصية", "بياناتي", "آمن", "موثوق", "ثقة", "مصداقية", "سمعة", "تجربة", "خبرة", "سنوات"],
    reply: "🌟 متجر هبة الرحمن:\n\n📍 الموقع: ليبيا - طرابلس\n🌐 الموقع: hibatrahman.xyz\n📱 متوافق مع الهواتف\n\n💎 ما يميزنا:\n✅ جودة عالية ومنتجات أصلية\n✅ مصداقية وثقة\n✅ خدمة ممتازة قبل وبعد البيع\n✅ توصيل لكل مدن ليبيا\n✅ منتجات حصرية ومميزة\n\n🔒 بياناتكِ آمنة ومحمية",
    buttons: [
      { label: "🛒 تسوقي الآن", value: "رابط_المتجر" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "تتبع",
    keywords: ["حالة طلبي", "تتبع", "متابعة", "وين طلبي", "وصل", "فين طلبي", "اين طلبي", "طلبي وصل", "الطلب وصل", "رقم الطلب", "تتبع الطلب", "track", "tracking", "order status", "متى يوصل طلبي", "حالة الشحن", "الشحنة", "المندوب وصل", "إشعارات", "اشعارات"],
    reply: "📦 لمتابعة طلبكِ:\n\n1️⃣ ادخلي صفحة تتبع الطلب\n2️⃣ أدخلي رقم الطلب (موجود في رسالة واتساب)\n3️⃣ ستظهر لكِ حالة الطلب\n\n📊 حالات الطلب:\n🟡 جاري التجهيز\n🔵 في الطريق\n🟢 تم التوصيل\n\nأو راسلينا برقم الطلب وسنخبرك بالحالة!",
    buttons: [
      { label: "📦 تتبع الطلب", value: "رابط_التتبع" },
      { label: "📱 واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "هدايا",
    keywords: ["هدية", "إهداء", "اهداء", "هدايا", "gift", "تغليف", "تغليف هدايا", "تغليف أنيق", "علبة", "هدية لصديقتي", "هدية لأمي", "هدية لزوجتي", "هدية عيد ميلاد", "هدية زواج", "هدية تخرج", "مناسبة", "ارسل هدية"],
    reply: "🎁 خدمة الهدايا:\n\n✅ شراء هدية وإرسالها لشخص آخر\n✅ تغليف أنيق وفاخر\n✅ إضافة بطاقة تهنئة\n✅ فقط زودينا ببيانات المستلم\n\nراسلينا لترتيب الهدية 👇",
    buttons: [
      { label: "📱 ترتيب الهدية", value: "واتساب_مباشر" },
      { label: "🛒 تصفحي المنتجات", value: "رابط_المتجر" },
    ],
  },
  {
    name: "الوان",
    keywords: ["لون", "ألوان", "الوان", "مقاس", "مقاسات", "حجم", "أحجام", "size", "color", "ذهبي", "فضي", "أسود", "أبيض", "وردي", "أحمر", "أزرق", "بني", "بيج", "كبير", "صغير", "وسط", "medium", "large", "small", "XL", "هل متوفر باللون", "عندكم لون", "فيه لون ثاني"],
    reply: "🎨 الألوان والمقاسات:\n\n✅ كل منتج يظهر الألوان المتاحة في صفحته\n✅ اضغطي على المنتج لمعرفة التفاصيل\n✅ إذا اللون/المقاس غير متوفر راسلينا",
    buttons: [
      { label: "🛒 تصفحي المنتجات", value: "رابط_المتجر" },
      { label: "📱 اسألي عن لون", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "حساب",
    keywords: ["تسجيل", "حساب", "تسجيل مجاني", "كلمة المرور", "نسيت كلمة", "باسوورد", "password", "login", "register", "دخول", "تسجيل دخول", "إنشاء حساب", "بدون حساب", "بدون تسجيل", "تعديل بياناتي", "تغيير بياناتي"],
    reply: "👤 معلومات الحساب:\n\n✅ التسجيل مجاني بالكامل\n✅ يمكن التسوق بدون حساب عبر واتساب\n✅ تغيير كلمة المرور من الإعدادات\n🔒 بياناتكِ محمية وآمنة",
    buttons: [
      { label: "🛒 تسوقي الآن", value: "رابط_المتجر" },
      { label: "📱 اطلبي عبر واتساب", value: "واتساب_مباشر" },
    ],
  },
  {
    name: "تقييم",
    keywords: ["تقييم", "مراجعة", "رأي", "آراء", "تعليق", "تعليقات", "review", "rating", "نجوم", "تقييمات حقيقية", "رأي العملاء"],
    reply: "⭐ نرحب بآراء وتقييمات عملائنا!\n✅ يمكنكِ التقييم بعد الشراء\n✅ التقييمات حقيقية وشفافة\n\nرأيكِ يهمنا 💕",
  },
  {
    name: "مفضلة",
    keywords: ["مفضلة", "حفظ", "قائمة امنياتي", "wishlist", "favorite", "مشاركة", "شارك", "share"],
    reply: "❤️ المفضلة:\n\n✅ اضغطي ❤️ على أي منتج لحفظه\n✅ شوفي المفضلة من صفحة المفضلة\n✅ شاركي المنتجات مع صديقاتك",
    buttons: [
      { label: "❤️ المفضلة", value: "رابط_المفضلة" },
      { label: "🛒 المتجر", value: "رابط_المتجر" },
    ],
  },
  {
    name: "بعد البيع",
    keywords: ["بعد البيع", "ما بعد البيع", "بعد الشراء", "خدمة بعد", "after sale", "صيانة", "تصليح", "اقتراح", "اقترح", "تعاون", "شراكة"],
    reply: "🤝 خدمة ما بعد البيع:\n\n✅ رضا العميل من أولوياتنا\n✅ دعم فني ومساعدة بعد الشراء\n✅ استبدال المنتجات المعيبة\n✅ نرحب بالاقتراحات والشراكات\n\nنحن هنا لخدمتكِ دائماً! 💕",
    buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }],
  },
  {
    name: "سوشال",
    keywords: ["فيسبوك", "فيس", "facebook", "fb", "انستغرام", "انستقرام", "instagram", "insta", "تيك توك", "تيكتوك", "tiktok", "سناب", "يوتيوب", "تويتر", "حساباتكم", "صفحتكم", "تابعوني", "فولو", "follow"],
    reply: "📱 حساباتنا:\n\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\n✅ تابعينا لآخر المنتجات والعروض!",
    buttons: [
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    name: "شكر",
    keywords: ["شكرا", "شكراً", "مشكور", "مشكورة", "تسلم", "تسلمي", "يعطيك العافية", "ممتنة", "الله يجزاك خير", "جزاك الله خير", "بارك الله فيك", "thanks", "thank you", "ممتاز", "رائع", "حلو", "جميل", "مع السلامة", "باي", "bye", "الله يسلمك", "وداعا"],
    reply: "العفو حبيبتي! 🌹\nنورتِ متجر هبة الرحمن\n\n💕 نتمنى لكِ تجربة تسوق سعيدة!\n\nتابعينا لآخر العروض 📱\n\nإذا تحتاجين أي شيء أنا هنا! 😊\n\nمع السلامة 👋",
    buttons: [
      { label: "📘 فيسبوك", value: "فيسبوك_مباشر" },
      { label: "📸 إنستغرام", value: "انستغرام_مباشر" },
      { label: "🎵 تيك توك", value: "تيكتوك_مباشر" },
    ],
  },
  {
    name: "جملة",
    keywords: ["كمية كبيرة", "جملة", "كميات", "بالجملة", "wholesale", "bulk", "خصم للكمية", "تاجر", "موزع", "وكيل", "طلبية كبيرة"],
    reply: "📦 طلبات الجملة:\n\n✅ نوفر طلبات الجملة والتجزئة\n✅ خصومات خاصة للكميات الكبيرة\n✅ توصيل لكل المناطق\n\nراسلينا لمعرفة التفاصيل 👇",
    buttons: [{ label: "📱 واتساب للجملة", value: "واتساب_مباشر" }],
  },
  {
    name: "عام",
    keywords: ["كيف", "شنو", "ايش", "هل", "ليش", "لماذا", "ممكن", "يمكن", "اقدر", "تقدر", "نقدر", "عندكم", "لديكم", "فيه", "يوجد", "هل يوجد", "موجود"],
    reply: "أهلاً! 🌸 كيف أقدر أساعدكِ؟\n\nاختاري من المواضيع أو اكتبي سؤالك:",
    buttons: [
      { label: "🛍️ المنتجات", value: "المنتجات" },
      { label: "💰 الأسعار", value: "الأسعار" },
      { label: "🚚 التوصيل", value: "التوصيل" },
      { label: "🏷️ العروض", value: "عروض" },
      { label: "📞 تواصل", value: "تواصل" },
    ],
  },
];

const DEFAULT_REPLY = {
  text: "عذراً ما فهمت سؤالكِ 🤍\n\nيمكنكِ:\n1️⃣ اختاري من الأزرار\n2️⃣ اكتبي سؤالك بطريقة ثانية\n3️⃣ تواصلي على واتساب\n\nفريقنا جاهز لخدمتكِ! 💕",
  buttons: [
    { label: "📱 واتساب", value: "واتساب_مباشر" },
    { label: "🛍️ المنتجات", value: "المنتجات" },
    { label: "🚚 التوصيل", value: "التوصيل" },
    { label: "🏷️ العروض", value: "عروض" },
  ] as QuickButton[],
};

function getTime(): string {
  return new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" });
}

function getBotReply(userMessage: string): { text: string; buttons?: QuickButton[] } {
  const msg = userMessage.toLowerCase().trim();
  let bestMatch: Category | null = null;
  let bestScore = 0;

  for (const category of SMART_CATEGORIES) {
    let score = 0;
    for (const keyword of category.keywords) {
      if (msg.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  if (bestMatch && bestScore > 0) {
    return { text: bestMatch.reply, buttons: bestMatch.buttons };
  }
  return { text: DEFAULT_REPLY.text, buttons: DEFAULT_REPLY.buttons };
}

export default function AutoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أخدمكِ؟",
      sender: "bot",
      time: getTime(),
      buttons: [
        { label: "🛍️ المنتجات", value: "المنتجات" },
        { label: "💰 الأسعار", value: "الأسعار" },
        { label: "🚚 التوصيل", value: "التوصيل" },
        { label: "🏷️ العروض", value: "عروض" },
        { label: "📞 تواصل", value: "تواصل" },
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

  const fetchRealOffers = async (): Promise<string> => {
    try {
      const { data: promos } = await supabase.from("promo_codes").select("*").eq("is_active", true);
      if (promos && promos.length > 0) {
        let text = "🎉 العروض المتاحة حالياً:\n\n";
        promos.forEach((p: any) => { text += `🏷️ كود: ${p.code} — خصم ${p.discount_percentage}%\n`; });
        text += "\n✅ أدخلي الكود في صفحة الدفع!";
        return text;
      }
      return "😔 لا توجد أكواد خصم حالياً.\n\nتابعينا لعروض جديدة قريباً! 🎉";
    } catch {
      return "🏷️ تابعي صفحتنا لآخر العروض!";
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    if (SOCIAL_LINKS[messageText]) {
      const link = SOCIAL_LINKS[messageText];
      if (link.startsWith("/")) { window.location.href = link; } else { window.open(link, "_blank"); }
      return;
    }

    const userMsg: Message = { id: Date.now(), text: messageText, sender: "user", time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

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

      setMessages((prev) => [...prev, { id: Date.now() + 1, text: replyText, sender: "bot", time: getTime(), buttons: replyButtons }]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => { setIsOpen(true); setUnread(0); }}
            className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-gradient-to-br from-luxury-beige to-amber-600 rounded-full shadow-2xl shadow-luxury-beige/30 flex items-center justify-center hover:shadow-luxury-beige/50 transition-shadow">
            <MessageCircle className="w-7 h-7 text-dark-900" />
            {unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
                {unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-[95] w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-3rem)] bg-dark-900 border border-luxury-beige/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">

            <div className="bg-gradient-to-r from-luxury-beige/20 to-amber-900/20 border-b border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-luxury-beige to-amber-600 rounded-full flex items-center justify-center">
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
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "bot" ? "bg-gradient-to-br from-luxury-beige to-amber-600" : "bg-white/10"}`}>
                    {msg.sender === "bot" ? <Bot className="w-4 h-4 text-dark-900" /> : <User className="w-4 h-4 text-white/60" />}
                  </div>
                  <div className={`max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === "bot" ? "bg-white/5 text-luxury-cream rounded-tl-sm border border-white/5" : "bg-gradient-to-r from-luxury-beige to-amber-600 text-dark-900 rounded-tr-sm font-medium"}`}>
                      {msg.text}
                    </div>
                    {msg.buttons && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.buttons.map((btn, i) => (
                          <button key={i} onClick={() => handleSend(btn.value)} className="px-3 py-1.5 text-[11px] rounded-full border border-luxury-beige/30 text-luxury-beige hover:bg-luxury-beige hover:text-dark-900 transition-all whitespace-nowrap">
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
                <input type="text" placeholder="اكتبي سؤالك..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-sm text-luxury-cream placeholder:text-white/20 text-right" />
                <button onClick={() => handleSend()} disabled={!input.trim()}
                  className="p-2 rounded-full bg-gradient-to-r from-luxury-beige to-amber-600 text-dark-900 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-luxury-beige/30 transition-all">
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