import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "دار هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة 2026",
  description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026. عطور، مجوهرات، حقائب يد، ساعات فاخرة، وإكسسوارات statement من دار هبة الرحمن.",
  keywords: "إكسسوارات فاخرة, موضة 2026, مجوهرات statement, عطور عربية, حقائب يد فاخرة, ساعات سويسرية, Layering Jewellery, Resin Jewellery, Y2K Accessories, دار هبة الرحمن",
  authors: [{ name: "دار هبة الرحمن" }],
  openGraph: {
    title: "دار هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة",
    description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026",
    type: "website",
    locale: "ar_LY",
    siteName: "دار هبة الرحمن",
  },
  twitter: {
    card: "summary_large_image",
    title: "دار هبة الرحمن | إكسسوارات فاخرة 2026",
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
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
