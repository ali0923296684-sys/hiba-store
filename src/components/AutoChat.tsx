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

interface Category { name: string; keywords: string[]; reply: string; buttons?: QuickButton[]; }

const SMART_CATEGORIES: Category[] = [
  { name: "تحية", keywords: ["سلام", "هلا", "مرحبا", "هاي", "السلام", "اهلا", "أهلا", "مساء الخير", "صباح الخير", "مساء النور", "صباح النور", "كيف الحال", "كيفك", "شخبارك", "شلونك", "اهلين", "يا هلا", "حياك", "الله يحييك", "hi", "hello", "hey", "السلام عليكم", "وعليكم السلام", "تحياتي", "مرحبتين"], reply: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أساعدكِ اليوم؟\n\nاختاري من الخيارات أو اكتبي سؤالك:", buttons: [{ label: "🛍️ تصفح المنتجات", value: "المنتجات" }, { label: "💰 الأسعار", value: "الأسعار" }, { label: "🚚 التوصيل", value: "التوصيل" }, { label: "🏷️ العروض", value: "عروض" }, { label: "📞 تواصل معنا", value: "تواصل" }] },
  { name: "طلب", keywords: ["كيف اطلب", "طريقة الطلب", "كيف يمكنني الطلب", "كيف أبدأ", "كيف ابدا", "كيف اشتري", "طريقة الشراء", "عايزة اطلب", "ابي اطلب", "نبي نطلب", "ابغى اطلب", "كيف اسوي طلب", "خطوات الطلب", "اريد طلب", "ابي اشتري", "نبي نشتري", "order", "how to order", "شراء", "اشتري", "طلب", "اطلب", "اريد شراء", "كيف الطلب", "طريقة", "اطلب منتج", "اريد منتج", "كيف احصل", "ممكن اطلب", "ابغي", "ابي", "نبي", "عايز", "عايزة"], reply: "يمكنكِ إتمام طلبك بسهولة عبر:\n\n1️⃣ تصفحي المنتجات في المتجر\n2️⃣ أضيفي المنتج للسلة\n3️⃣ أكملي بيانات التوصيل والدفع\n\n📱 أو راسلينا على واتساب: +218 93-536-4926\n\nنوصل لكل مدن ليبيا! 🇱🇾", buttons: [{ label: "🛒 زيارة المتجر", value: "رابط_المتجر" }, { label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "توصيل", keywords: ["توصيل", "شحن", "delivery", "يوصل", "التوصيل", "هل التوصيل", "كم التوصيل", "مدة التوصيل", "كم يوم", "متى يوصل", "كم تستغرق", "تاخر", "تأخر", "شحن سريع", "توصيل سريع", "رسوم التوصيل", "تكلفة التوصيل", "مجاني", "توصيل مجاني", "shipping", "يوصلون", "توصلون", "كيف يوصل", "طريقة التوصيل", "شركة التوصيل", "مندوب", "توصيل لطرابلس", "توصيل لبنغازي", "خارج طرابلس", "داخل طرابلس", "كل المدن", "وين توصلون", "هل توصلون", "موعد التوصيل", "استلام", "تسليم"], reply: "🚚 خدمة التوصيل الشاملة:\n\n📍 داخل طرابلس: 1-2 يوم عمل\n📍 بنغازي: 2-3 أيام\n📍 مصراتة: 2-3 أيام\n📍 باقي المدن: 3-5 أيام\n\n💰 رسوم التوصيل حسب المنطقة\n🎉 توصيل مجاني للطلبات الكبيرة!\n✅ الدفع عند الاستلام متاح!", buttons: [{ label: "🛒 اطلبي الآن", value: "رابط_المتجر" }, { label: "📱 اسألي عن مدينتك", value: "واتساب_مباشر" }, { label: "📦 تتبع طلب", value: "رابط_التتبع" }] },
  { name: "سعر", keywords: ["السعر", "الأسعار", "الاسعار", "كم سعر", "بكم", "ثمن", "غالي", "رخيص", "سعر", "price", "كم", "تكلفة", "قيمة", "كم يكلف", "كم سعره", "بكم هذا", "بكم المنتج", "شنو السعر", "ايش السعر", "سعر المنتج", "اسعار المنتجات", "ارخص", "اغلى", "مناسب", "اسعار منافسة", "تفاوض"], reply: "💰 معلومات الأسعار:\n\n✅ الأسعار موجودة تحت كل منتج في المتجر\n✅ يتم تحديثها باستمرار\n✅ أسعار منافسة وعادلة\n\n🏷️ عندنا عروض وخصومات دائمة!\n\nتصفحي المتجر لمعرفة الأسعار 👇", buttons: [{ label: "🛒 تصفحي الأسعار", value: "رابط_المتجر" }, { label: "🏷️ العروض", value: "عروض" }, { label: "📱 اسألي عن سعر", value: "واتساب_مباشر" }] },
  { name: "عروض", keywords: ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود", "خصومات", "تنزيلات", "sale", "discount", "offer", "promo", "كود خصم", "كوبون خصم", "عرض خاص", "تخفيضات", "نسبة خصم", "كم الخصم", "فيه خصم", "عندكم خصم", "هل يوجد خصم", "كيف استخدم الكود", "عملاء دائمين", "عروض موسمية"], reply: "⏳ جاري البحث عن العروض المتاحة...", buttons: [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }] },
  { name: "دفع", keywords: ["دفع", "طرق الدفع", "كيف ادفع", "كاش", "بطاقة", "تحويل", "نقد", "payment", "دفع عند الاستلام", "كاش عند الاستلام", "تحويل بنكي", "تحويل مصرفي", "فاتورة", "فواتير", "دفع مسبق", "آمن", "أمان الدفع", "الموقع آمن"], reply: "💳 طرق الدفع المتاحة:\n\n💵 كاش عند الاستلام (الأكثر استخداماً ✅)\n🏦 تحويل مصرفي / بنكي\n📱 عبر تطبيقات الدفع المحلية\n\n🔒 جميع المعاملات آمنة\n🧾 فواتير متاحة عند الطلب\n\n✅ الدفع عند الاستلام متاح لجميع مدن ليبيا!", buttons: [{ label: "🛒 اطلبي الآن", value: "رابط_المتجر" }, { label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "منتجات", keywords: ["المنتجات", "منتجات", "شنو عندكم", "ايش عندكم", "تبيعون", "أصناف", "شنو تبيعون", "ماذا تبيعون", "products", "تشكيلة", "كل المنتجات", "اصلية", "أصلية", "جودة", "مضمونة", "مطابقة للصور", "متوفر", "موجود", "جديدة", "جديد", "حصرية", "فاخرة", "فخمة"], reply: "عندنا تشكيلة فخمة تشمل:\n\n👜 حقائب فاخرة\n⌚ ساعات أنيقة\n🧴 عطور مميزة\n💍 إكسسوارات\n👗 ملابس نسائية\n👠 أحذية فاخرة\n\n✅ جميع منتجاتنا أصلية وعالية الجودة\n✅ الأسعار موجودة في صفحة كل منتج\n✅ منتجات جديدة كل أسبوع!\n\nتصفحي المتجر 👇", buttons: [{ label: "🛒 زيارة المتجر", value: "رابط_المتجر" }, { label: "❤️ المفضلة", value: "رابط_المفضلة" }] },
  { name: "ساعات", keywords: ["ساعة", "ساعات", "orsga", "watch", "ساعة يد", "ساعه", "ساعات نسائية", "ساعة ذهبية", "ساعة فضية", "ساعة اصلية", "ضمان الساعة"], reply: "⌚ مجموعة الساعات الفاخرة:\n\n✅ ساعات نسائية أصلية\n✅ ضمان على الماكينة\n✅ متوفرة بعدة ألوان\n✅ تصاميم عصرية وكلاسيكية\n📦 تغليف فاخر مجاني\n\n💰 شوفي الأسعار في المتجر 👇", buttons: [{ label: "🛒 شوفي الساعات", value: "رابط_المتجر" }] },
  { name: "عطور", keywords: ["عطر", "عطور", "برفان", "ريحة", "perfume", "رائحة", "عطر نسائي", "عطر رجالي", "عطر ثابت", "بخور", "عود", "مسك"], reply: "🌸 مجموعة العطور الفاخرة:\n\n✅ عطور ثابتة درجة أولى\n✅ روائح عربية وعالمية\n✅ نسائية ورجالية\n🎁 تغليف هدايا متاح\n\n💰 شوفي الأسعار في المتجر 👇", buttons: [{ label: "🛒 شوفي العطور", value: "رابط_المتجر" }] },
  { name: "حقائب", keywords: ["حقيبة", "حقائب", "شنطة", "شنط", "bag", "حقيبة يد", "حقيبة جلد", "حقيبة كتف", "كلتش", "محفظة"], reply: "👜 مجموعة الحقائب الفاخرة:\n\n✅ جلد طبيعي ومقاوم\n✅ موديلات جديدة كل أسبوع\n✅ أحجام متنوعة\n✅ ألوان متعددة\n\n💰 شوفي الأسعار في المتجر 👇", buttons: [{ label: "🛒 شوفي الحقائب", value: "رابط_المتجر" }] },
  { name: "اكسسوارات", keywords: ["اكسسوار", "إكسسوار", "اكسسوارات", "مجوهرات", "خاتم", "خواتم", "سلسلة", "سلاسل", "قلادة", "اسوارة", "حلق", "أقراط", "اطقم", "طقم", "jewelry", "accessories", "نظارة", "نظارات"], reply: "💍 مجموعة الإكسسوارات والمجوهرات:\n\n✅ خواتم، سلاسل، أساور، أقراط\n✅ أطقم كاملة\n✅ نظارات شمسية\n🎁 مثالية كهدايا!\n\n💰 شوفي الأسعار في المتجر 👇", buttons: [{ label: "🛒 شوفي الإكسسوارات", value: "رابط_المتجر" }] },
  { name: "ارجاع", keywords: ["ارجاع", "استرجاع", "تبديل", "استبدال", "ضمان", "مرتجع", "تالف", "مكسور", "معيب", "عيب", "مشكلة بالمنتج", "المنتج غلط", "return", "exchange", "refund", "استرداد", "كيف ارجع", "ممكن ارجع", "إلغاء", "الغاء", "الغي الطلب", "تعديل الطلب"], reply: "🔄 سياسة الاستبدال والإرجاع:\n\n✅ استبدال خلال 3 أيام من الاستلام\n✅ المنتج لازم يكون بحالته الأصلية\n✅ مع الفاتورة والتغليف الأصلي\n✅ إلغاء الطلب ممكن قبل الشحن\n\n📞 تواصلي معنا لترتيب الاستبدال:", buttons: [{ label: "📱 واتساب فوراً", value: "واتساب_مباشر" }, { label: "📞 اتصال", value: "اتصال_مباشر" }] },
  { name: "تواصل", keywords: ["تواصل", "رقم", "هاتف", "واتساب", "واتس", "whatsapp", "اتصال", "تلفون", "خدمة العملاء", "رقم الهاتف", "رقم الواتساب", "كيف اتواصل", "جوال", "موبايل", "phone", "contact", "ساعات العمل", "متى تفتحون", "دوام", "متى ترد", "سرعة الرد", "مشكلة", "شكوى", "دعم", "دعم فني", "مساعدة", "help"], reply: "📞 قنوات التواصل:\n\n📱 واتساب: +218 93-536-4926\n📞 هاتف: +218 93-536-4926\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\n⏰ نستقبل الطلبات على مدار الساعة!\n⚡ الرد خلال دقائق على الواتساب", buttons: [{ label: "📱 واتساب مباشر", value: "واتساب_مباشر" }, { label: "📘 فيسبوك", value: "فيسبوك_مباشر" }, { label: "📸 إنستغرام", value: "انستغرام_مباشر" }, { label: "🎵 تيك توك", value: "تيكتوك_مباشر" }] },
  { name: "عن المتجر", keywords: ["من نحن", "من انتم", "هبة الرحمن", "عن المتجر", "about", "لماذا", "ليش اختار", "ما يميز", "أين يقع", "اين يقع", "موقعكم", "فين", "متجر فعلي", "محل", "الموقع", "موقع الكتروني", "بيانات آمنة", "خصوصية", "آمن", "موثوق"], reply: "🌟 متجر هبة الرحمن:\n\n📍 ليبيا - طرابلس\n🌐 hibatrahman.xyz\n\n💎 ما يميزنا:\n✅ جودة عالية ومنتجات أصلية\n✅ مصداقية وثقة\n✅ خدمة ممتازة قبل وبعد البيع\n✅ توصيل لكل مدن ليبيا\n✅ منتجات حصرية\n\n🔒 بياناتكِ آمنة", buttons: [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }, { label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "تتبع", keywords: ["حالة طلبي", "تتبع", "متابعة", "وين طلبي", "وصل", "فين طلبي", "رقم الطلب", "تتبع الطلب", "track", "متى يوصل طلبي", "حالة الشحن", "إشعارات"], reply: "📦 لمتابعة طلبكِ:\n\n1️⃣ ادخلي صفحة تتبع الطلب\n2️⃣ أدخلي رقم الطلب\n3️⃣ ستظهر لكِ حالة الطلب\n\n📊 الحالات:\n🟡 جاري التجهيز\n🔵 في الطريق\n🟢 تم التوصيل", buttons: [{ label: "📦 تتبع الطلب", value: "رابط_التتبع" }, { label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "هدايا", keywords: ["هدية", "إهداء", "اهداء", "هدايا", "gift", "تغليف", "تغليف هدايا", "هدية لصديقتي", "هدية لأمي", "هدية عيد ميلاد", "ارسل هدية"], reply: "🎁 خدمة الهدايا:\n\n✅ شراء هدية وإرسالها لشخص آخر\n✅ تغليف أنيق وفاخر\n✅ فقط زودينا ببيانات المستلم\n\nراسلينا لترتيب الهدية 👇", buttons: [{ label: "📱 ترتيب الهدية", value: "واتساب_مباشر" }, { label: "🛒 تصفحي المنتجات", value: "رابط_المتجر" }] },
  { name: "الوان", keywords: ["لون", "ألوان", "الوان", "مقاس", "مقاسات", "حجم", "size", "color", "ذهبي", "فضي", "أسود", "أبيض", "وردي", "هل متوفر باللون", "عندكم لون", "فيه لون ثاني"], reply: "🎨 الألوان والمقاسات:\n\n✅ كل منتج يظهر الألوان المتاحة في صفحته\n✅ اضغطي على المنتج لمعرفة التفاصيل\n✅ إذا اللون غير متوفر راسلينا", buttons: [{ label: "🛒 تصفحي المنتجات", value: "رابط_المتجر" }, { label: "📱 اسألي عن لون", value: "واتساب_مباشر" }] },
  { name: "حساب", keywords: ["تسجيل", "حساب", "كلمة المرور", "نسيت كلمة", "login", "register", "دخول", "بدون حساب", "تعديل بياناتي"], reply: "👤 معلومات الحساب:\n\n✅ التسجيل مجاني\n✅ يمكن التسوق بدون حساب عبر واتساب\n✅ تغيير كلمة المرور من الإعدادات\n🔒 بياناتكِ محمية", buttons: [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }, { label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "تقييم", keywords: ["تقييم", "مراجعة", "رأي", "آراء", "تعليق", "review", "rating", "تقييمات حقيقية"], reply: "⭐ نرحب بآراء وتقييمات عملائنا!\n✅ يمكنكِ التقييم بعد الشراء\n✅ التقييمات حقيقية وشفافة\n\nرأيكِ يهمنا 💕" },
  { name: "مفضلة", keywords: ["مفضلة", "حفظ", "wishlist", "favorite", "مشاركة", "شارك", "share"], reply: "❤️ المفضلة:\n\n✅ اضغطي ❤️ على أي منتج لحفظه\n✅ شوفي المفضلة من صفحة المفضلة\n✅ شاركي المنتجات مع صديقاتك", buttons: [{ label: "❤️ المفضلة", value: "رابط_المفضلة" }, { label: "🛒 المتجر", value: "رابط_المتجر" }] },
  { name: "بعد البيع", keywords: ["بعد البيع", "ما بعد البيع", "بعد الشراء", "صيانة", "اقتراح", "تعاون", "شراكة"], reply: "🤝 خدمة ما بعد البيع:\n\n✅ رضا العميل من أولوياتنا\n✅ استبدال المنتجات المعيبة\n✅ نرحب بالاقتراحات\n\nنحن هنا لخدمتكِ دائماً! 💕", buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }] },
  { name: "سوشال", keywords: ["فيسبوك", "فيس", "facebook", "انستغرام", "انستقرام", "instagram", "تيك توك", "تيكتوك", "tiktok", "حساباتكم", "صفحتكم", "فولو", "follow"], reply: "📱 حساباتنا:\n\n📘 فيسبوك: هبة الرحمن\n📸 إنستغرام: @heba.alrahman.store\n🎵 تيك توك: @haybatalrahman.com0\n\n✅ تابعينا لآخر المنتجات والعروض!", buttons: [{ label: "📘 فيسبوك", value: "فيسبوك_مباشر" }, { label: "📸 إنستغرام", value: "انستغرام_مباشر" }, { label: "🎵 تيك توك", value: "تيكتوك_مباشر" }] },
  { name: "شكر", keywords: ["شكرا", "شكراً", "مشكور", "مشكورة", "تسلم", "تسلمي", "يعطيك العافية", "ممتنة", "الله يجزاك خير", "thanks", "thank you", "ممتاز", "رائع", "مع السلامة", "باي", "bye", "وداعا"], reply: "العفو حبيبتي! 🌹\nنورتِ متجر هبة الرحمن\n\n💕 نتمنى لكِ تجربة تسوق سعيدة!\n\nإذا تحتاجين أي شيء أنا هنا! 😊\n\nمع السلامة 👋", buttons: [{ label: "📘 فيسبوك", value: "فيسبوك_مباشر" }, { label: "📸 إنستغرام", value: "انستغرام_مباشر" }, { label: "🎵 تيك توك", value: "تيكتوك_مباشر" }] },
  { name: "جملة", keywords: ["كمية كبيرة", "جملة", "كميات", "بالجملة", "wholesale", "خصم للكمية", "تاجر", "موزع", "طلبية كبيرة"], reply: "📦 طلبات الجملة:\n\n✅ نوفر طلبات الجملة والتجزئة\n✅ خصومات خاصة للكميات الكبيرة\n✅ توصيل لكل المناطق\n\nراسلينا لمعرفة التفاصيل 👇", buttons: [{ label: "📱 واتساب للجملة", value: "واتساب_مباشر" }] },
  { name: "عام", keywords: ["كيف", "شنو", "ايش", "هل", "ليش", "لماذا", "ممكن", "يمكن", "اقدر", "عندكم", "فيه", "يوجد", "هل يوجد", "موجود"], reply: "أهلاً! 🌸 كيف أقدر أساعدكِ؟\n\nاختاري من المواضيع أو اكتبي سؤالك:", buttons: [{ label: "🛍️ المنتجات", value: "المنتجات" }, { label: "💰 الأسعار", value: "الأسعار" }, { label: "🚚 التوصيل", value: "التوصيل" }, { label: "🏷️ العروض", value: "عروض" }, { label: "📞 تواصل", value: "تواصل" }] },
];

const DEFAULT_REPLY = {
  text: "عذراً ما فهمت سؤالكِ 🤍\n\nيمكنكِ:\n1️⃣ اختاري من الأزرار\n2️⃣ اكتبي سؤالك بطريقة ثانية\n3️⃣ تواصلي على واتساب\n\nفريقنا جاهز لخدمتكِ! 💕",
  buttons: [{ label: "📱 واتساب", value: "واتساب_مباشر" }, { label: "🛍️ المنتجات", value: "المنتجات" }, { label: "🚚 التوصيل", value: "التوصيل" }, { label: "🏷️ العروض", value: "عروض" }] as QuickButton[],
};

function getTime(): string { return new Date().toLocaleTimeString("ar-LY", { hour: "2-digit", minute: "2-digit" }); }

function getBotReply(userMessage: string): { text: string; buttons?: QuickButton[] } {
  const msg = userMessage.toLowerCase().trim();
  let bestMatch: Category | null = null;
  let bestScore = 0;
  for (const category of SMART_CATEGORIES) {
    let score = 0;
    for (const keyword of category.keywords) { if (msg.includes(keyword.toLowerCase())) { score += keyword.length; } }
    if (score > bestScore) { bestScore = score; bestMatch = category; }
  }
  if (bestMatch && bestScore > 0) return { text: bestMatch.reply, buttons: bestMatch.buttons };
  return { text: DEFAULT_REPLY.text, buttons: DEFAULT_REPLY.buttons };
}

export default function AutoChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 1, text: "أهلاً وسهلاً بكِ في متجر هبة الرحمن! 🌸\nكيف أقدر أخدمكِ؟", sender: "bot", time: getTime(), buttons: [{ label: "🛍️ المنتجات", value: "المنتجات" }, { label: "💰 الأسعار", value: "الأسعار" }, { label: "🚚 التوصيل", value: "التوصيل" }, { label: "🏷️ العروض", value: "عروض" }, { label: "📞 تواصل", value: "تواصل" }] }]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchRealOffers = async (): Promise<string> => {
    try {
      const { data: promos } = await supabase.from("promo_codes").select("*").eq("is_active", true);
      if (promos && promos.length > 0) { let text = "🎉 العروض المتاحة حالياً:\n\n"; promos.forEach((p: any) => { text += `🏷️ كود: ${p.code} — خصم ${p.discount_percentage}%\n`; }); text += "\n✅ أدخلي الكود في صفحة الدفع!"; return text; }
      return "😔 لا توجد أكواد خصم حالياً.\n\nتابعينا لعروض جديدة قريباً! 🎉";
    } catch { return "🏷️ تابعي صفحتنا لآخر العروض!"; }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;
    if (SOCIAL_LINKS[messageText]) { const link = SOCIAL_LINKS[messageText]; if (link.startsWith("/")) { window.location.href = link; } else { window.open(link, "_blank"); } return; }
    const userMsg: Message = { id: Date.now(), text: messageText, sender: "user", time: getTime() };
    setMessages((prev) => [...prev, userMsg]); setInput(""); setIsTyping(true);
    const isAskingOffers = ["عرض", "عروض", "خصم", "تخفيض", "كوبون", "كود", "خصومات"].some((k) => messageText.toLowerCase().includes(k));
    setTimeout(async () => {
      let replyText: string; let replyButtons: QuickButton[] | undefined;
      if (isAskingOffers) { replyText = await fetchRealOffers(); replyButtons = [{ label: "🛒 تسوقي الآن", value: "رابط_المتجر" }]; }
      else { const reply = getBotReply(messageText); replyText = reply.text; replyButtons = reply.buttons; }
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: replyText, sender: "bot", time: getTime(), buttons: replyButtons }]); setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <>
      {/* ====== فقاعة الشات المتحركة ====== */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            drag
            dragMomentum={false}
            dragElastic={0.1}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) {
                setIsOpen(true); setUnread(0);
              }
            }}
            onClick={() => { setIsOpen(true); setUnread(0); }}
            className="fixed bottom-24 right-4 z-[90] w-14 h-14 bg-gradient-to-br from-luxury-beige to-amber-600 rounded-full shadow-2xl shadow-luxury-beige/30 flex items-center justify-center hover:shadow-luxury-beige/50 transition-shadow cursor-grab active:cursor-grabbing select-none"
            style={{ touchAction: "none" }}
          >
            <MessageCircle className="w-6 h-6 text-dark-900 pointer-events-none" />
            {unread > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center pointer-events-none">
                {unread}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ====== نافذة الشات ====== */}
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
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
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