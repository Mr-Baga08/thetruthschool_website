
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen flex items-center justify-center relative z-10 pt-20"
    >
      <div className="container mx-auto px-6 text-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-off-white mb-6 leading-tight">
            Stop Guessing.{' '}
            <span className="text-vibrant-gold">Start Getting Hired.</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-medium-gray mb-12 max-w-4xl mx-auto leading-relaxed">
            TheTruthSchool is the new AI-powered platform that gives you the honest feedback 
            and real-world skills you need to land a job at a top company.
          </h2>
          
          <Button 
            onClick={() => scrollToSection('conversion')}
            className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 text-lg px-8 py-6 font-semibold glow-hover animate-glow-pulse"
            size="lg"
          >
            Get Early Access
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
