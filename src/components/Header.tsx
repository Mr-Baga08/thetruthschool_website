
import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-medium-gray/20">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-vibrant-gold">
          TheTruthSchool
        </div>
        <Button 
          onClick={() => scrollToSection('conversion')}
          className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 font-semibold glow-hover"
        >
          Get Early Access
        </Button>
      </div>
    </header>
  );
};

export default Header;
