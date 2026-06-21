import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Categories from "@/components/Categories";
import FashionTrends from "@/components/FashionTrends";
import FashionTips from "@/components/FashionTips";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";
import NewArrivals from "@/components/NewArrivals";
import BestSellers from "@/components/BestSellers";
import WhyUs from "@/components/WhyUs";
import LibyaDelivery from "@/components/LibyaDelivery";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Categories />
      <NewArrivals />
      <BestSellers />
      <FeaturedProducts />
      <LibyaDelivery />
      <FashionTrends />
      <FashionTips />
      <AboutSection />
      <NewsSection />
    </>
  );
}