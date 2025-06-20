
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import ConversionSection from "@/components/ConversionSection";
import Footer from "@/components/Footer";
import DarkModeToggle from "@/components/DarkModeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-charcoal text-off-white relative overflow-x-hidden">
      <BackgroundAnimation />
      <Header />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <ConversionSection />
      <Footer/>
    </div>
  );
};

export default Index;
