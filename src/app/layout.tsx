import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AutoChat from "@/components/AutoChat";
import CartReminder from "@/components/CartReminder";

export const metadata: Metadata = {
  title: "هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة 2026",
  description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026. عطور، مجوهرات، حقائب يد، ساعات فاخرة. توصيل لجميع مدن ليبيا. متجر هبة الرحمن.",
  keywords: "إكسسوارات فاخرة, موضة 2026, عطور, حقائب يد, ساعات, مجوهرات, هبة الرحمن, متجر ليبيا, تسوق أونلاين, توصيل ليبيا, طرابلس, بنغازي, مصراتة",
  authors: [{ name: "هبة الرحمن" }],
  creator: "هبة الرحمن",
  publisher: "هبة الرحمن",
  metadataBase: new URL("https://hibatrahman.xyz"),
  alternates: { canonical: "https://hibatrahman.xyz" },
  openGraph: {
    title: "هبة الرحمن | وجهتكِ العالمية للإكسسوارات الفاخرة",
    description: "اكتشفي أحدث صيحات الإكسسوارات والموضة الفاخرة لعام 2026. توصيل لجميع مدن ليبيا.",
    type: "website",
    locale: "ar_LY",
    siteName: "هبة الرحمن",
    url: "https://hibatrahman.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "هبة الرحمن | إكسسوارات فاخرة 2026",
    description: "اكتشفي أحدث صيحات الموضة العالمية. توصيل لكل ليبيا.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "هبة الرحمن",
              url: "https://hibatrahman.xyz",
              description: "متجر إلكتروني للإكسسوارات والموضة الفاخرة في ليبيا",
              address: {
                "@type": "PostalAddress",
                addressLocality: "طرابلس",
                addressCountry: "LY",
              },
              telephone: "+218935364926",
              sameAs: [
                "https://www.facebook.com/share/18gxGwAqoi",
                "https://www.instagram.com/heba.alrahman.store",
                "https://www.tiktok.com/@haybatalrahman.com0",
              ],
            }),
          }}
        />

        <CartProvider>
          <WishlistProvider>
            <Navbar />
            <CartDrawer />
            <main className="relative overflow-hidden">
              {children}
            </main>
            <Footer />
            <AutoChat />
            <CartReminder />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}