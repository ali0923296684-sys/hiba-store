import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import FashionTrends from "@/components/FashionTrends";
import FashionTips from "@/components/FashionTips";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <FashionTrends />
      <FashionTips />
      <AboutSection />
      <NewsSection />
    </>
  );
}