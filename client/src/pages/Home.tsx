import HeroSection from "@/components/home/HeroSection";
import SearchSection from "@/components/home/SearchSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import DiscoverSection from "@/components/home/DiscoverSection";
import FeaturedAgents from "@/components/home/FeaturedAgents";
import WaitlistSection from "@/components/home/WaitlistSection";
import TestimonialSection from "@/components/home/TestimonialSection";
import CallToAction from "@/components/home/CallToAction";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SearchSection />
      <FeaturedProperties />
      <DiscoverSection />
      <FeaturedAgents />
      <WaitlistSection />
      <TestimonialSection />
      <CallToAction />
    </>
  );
}
