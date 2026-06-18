import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AutoChat from "@/components/AutoChat"; // ✅ السطر الجديد الاول: استيراد الشات

export const metadata: Metadata = {
  title: "هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة 2026",
  description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026. عطور، مجوهرات، حقائب يد، ساعات فاخرة، وإكسسوارات statement من هبة الرحمن.",
  keywords: "إكسسوارات فاخرة, موضة 2026, مجوهرات statement, عطور عربية, حقائب يد فاخرة, ساعات سويسرية, هبة الرحمن, متجر ليبيا",
  authors: [{ name: "هبة الرحمن" }],
  openGraph: {
    title: "هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة",
    description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026",
    type: "website",
    locale: "ar_LY",
    siteName: "هبة الرحمن",
  },
  twitter: {
    card: "summary_large_image",
    title: "هبة الرحمن | إكسسوارات فاخرة 2026",
    description: "اكتشفي أحدث صيحات الموضة العالمية",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050505] text-luxury-cream min-h-screen">
        <CartProvider>
          {/* العناصر المشتركة (تظهر في جميع الصفحات) */}
          <Navbar />
          <CartDrawer />
          
          {/* محتوى الصفحات المتغير */}
          <main className="relative overflow-hidden">
            {children}
          </main>
          
          {/* الفوتر (يظهر في جميع الصفحات) */}
          <Footer />

          <AutoChat /> {/* ✅ السطر الجديد الثاني: اظهار الشات في كل الصفحات */}
        </CartProvider>
      </body>
    </html>
  );
}