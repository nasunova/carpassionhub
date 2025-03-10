
import { useRef } from "react";
import HeroSection from "@/components/landing/HeroSection";
import LatestAdditionsSection from "@/components/landing/LatestAdditionsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import CommunitySection from "@/components/landing/CommunitySection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="overflow-x-hidden">
      <HeroSection />
      <LatestAdditionsSection />
      <FeaturesSection />
      <CommunitySection />
      <CTASection />
    </div>
  );
};

export default Index;
