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
import DeliveryMap from "@/components/DeliveryMap";

export default function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Categories />
      <NewArrivals />
      <BestSellers />
      <FeaturedProducts />
      <DeliveryMap />
      <FashionTrends />
      <FashionTips />
      <AboutSection />
      <NewsSection />
    </>
  );
}