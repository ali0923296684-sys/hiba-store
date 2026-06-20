import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AutoChat from "@/components/AutoChat";
import CartReminder from "@/components/CartReminder";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة 2026",
  description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026. عطور، مجوهرات، حقائب يد، ساعات فاخرة. توصيل لجميع مدن ليبيا.",
  keywords: "إكسسوارات فاخرة, موضة 2026, عطور, حقائب يد, ساعات, مجوهرات, هبة الرحمن, متجر ليبيا",
  authors: [{ name: "هبة الرحمن" }],
  metadataBase: new URL("https://hibatrahman.xyz"),
  alternates: { canonical: "https://hibatrahman.xyz" },
  openGraph: {
    title: "هبة الرحمن | إكسسوارات فاخرة",
    description: "توصيل لجميع مدن ليبيا",
    type: "website",
    locale: "ar_LY",
    siteName: "هبة الرحمن",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-[#050505] text-luxury-cream min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "Store", name: "هبة الرحمن",
          url: "https://hibatrahman.xyz", telephone: "+218935364926",
          address: { "@type": "PostalAddress", addressLocality: "طرابلس", addressCountry: "LY" },
          sameAs: ["https://www.facebook.com/share/18gxGwAqoi", "https://www.instagram.com/heba.alrahman.store", "https://www.tiktok.com/@haybatalrahman.com0"]
        })}} />
        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartDrawer />
            <main className="relative overflow-hidden pb-16 lg:pb-0">
              {children}
            </main>
            <Footer />
            <AutoChat />
            <CartReminder />
            <BottomNav />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}