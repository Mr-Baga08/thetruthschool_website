
import { useEffect, useRef, useState } from "react";
import { Brain, MessageCircle, Code, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Resume Review",
    description: "Get honest feedback that helps your resume beat the bots and impress humans."
  },
  {
    icon: MessageCircle,
    title: "Realistic Mock Interviews",
    description: "Practice with an AI that interviews like a real hiring manager."
  },
  {
    icon: Code,
    title: "Targeted Coding Challenges",
    description: "Solve the types of problems top tech companies actually use."
  },
  {
    icon: BarChart3,
    title: "Personalized Analytics",
    description: "Understand your true strengths and where you need to improve."
  }
];

const FeaturesSection = () => {
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

  return (
    <section 
      ref={sectionRef}
      className="py-20 relative z-10"
    >
      <div className="container mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-off-white mb-16 text-center">
            Prepare with{' '}
            <span className="text-vibrant-gold">Intelligence.</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-charcoal/50 border border-medium-gray/20 rounded-lg p-8 hover:border-muted-gold/40 transition-all duration-300 glow-hover"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <feature.icon className="w-12 h-12 text-muted-gold mb-6" />
                <h3 className="text-xl font-semibold text-off-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-medium-gray leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
