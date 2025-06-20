import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-md border-b border-medium-gray/20">
      <div className="container mx-auto px-2 sm:py-0  flex justify-between items-center">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          {/* Logo Image - Add your logo here */}
          <img 
            src="/logo.png" 
            alt="TheTruthSchool Logo" 
            className="sm:h-24 sm:w-24 h-16 w-16  "
            onError={(e) => {
              // Fallback to text if logo doesn't load
              e.currentTarget.style.display = 'none';
              const textLogo = e.currentTarget.nextElementSibling as HTMLElement;
              if (textLogo) textLogo.style.display = 'block';
            }}
          />
          {/* Text fallback */}
          <div className="text-2xl font-mono text-vibrant-gold relative -left-4" style={{"display":"none  "}}>
            TheTruth<span className="text-off-white">School</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <Button 
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-off-white hover:text-vibrant-gold hover:text-gray-800 sm:font-mono font-semibold sm:text-xl font-medium"
          >
            Blog
          </Button>
{/*           <Button 
            onClick={() => scrollToSection('conversion')}
            className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 font-semibold glow-hover"
          >
            Get Early Access
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
