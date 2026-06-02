import HeroSection from "@/components/sections/HeroSection";
import LiquidDrip from "@/components/ui/LiquidDrip";
import LiquidPillars from "@/components/sections/LiquidPillars";
import YearsMarquee from "@/components/sections/YearsMarquee";
import StoryTimeline from "@/components/sections/StoryTimeline";
import IndustriesSection from "@/components/sections/IndustriesSection";
import BrandWall from "@/components/sections/BrandWall";
import ProductCategories from "@/components/sections/ProductCategories";
import SiteFooter from "@/components/sections/SiteFooter";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LiquidDrip />
      <LiquidPillars />
      <YearsMarquee />
      <StoryTimeline />
      <IndustriesSection />
      <BrandWall />
      <ProductCategories />
      <SiteFooter />
    </>
  );
}
