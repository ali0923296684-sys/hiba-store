import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import FashionTrends from "@/components/FashionTrends";
import FashionTips from "@/components/FashionTips";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />
      <CartDrawer />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FashionTrends />
      <FashionTips />
      <AboutSection />
      <NewsSection />
      <Footer />
    </main>
  );
}
