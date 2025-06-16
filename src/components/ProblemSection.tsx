
import { useEffect, useRef, useState } from "react";

const ProblemSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold text-off-white mb-8 text-center">
            From Resume Black Holes to{' '}
            <span className="text-vibrant-gold">Real Feedback.</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-medium-gray leading-relaxed text-center">
              You've polished your resume, but hear nothing back. You ace the phone screen, 
              but stumble in the technical interview. The job market can feel like a black box. 
              TheTruthSchool was built to end the guesswork, giving you the clarity and confidence to succeed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
