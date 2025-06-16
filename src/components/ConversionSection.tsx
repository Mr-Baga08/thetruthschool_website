import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Linkedin, Twitter, Loader2, Instagram, Youtube } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuizData {
  frustration: string;
  aiCoachHelp: string;
  confidenceArea: string;
  additionalFeatures: string;
}

export const ConversionSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizStep, setCurrentQuizStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    frustration: "",
    aiCoachHelp: "",
    confidenceArea: "",
    additionalFeatures: ""
  });
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join waitlist');
      }
      
      setIsSubmitting(false);
      setShowQuiz(true);
      
      toast({
        title: "Welcome to TheTruthSchool!",
        description: data.message || "You're now on the early access list. Please help us by answering a few questions.",
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Error joining waitlist:', error);
      
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again or contact us if the problem persists.",
        variant: "destructive",
      });
    }
  };

  const handleQuizNext = async () => {
    if (currentQuizStep < 3) {
      setCurrentQuizStep(currentQuizStep + 1);
    } else {
      // Submit quiz data
      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            frustration: quizData.frustration,
            ai_coach_help: quizData.aiCoachHelp,
            confidence_area: quizData.confidenceArea,
            additional_features: quizData.additionalFeatures || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit feedback');
        }

        toast({
          title: "Thank you!",
          description: data.message || "Your feedback will help us build the perfect platform for you.",
        });
      } catch (error) {
        console.error('Error submitting feedback:', error);
        
        toast({
          title: "Feedback submission failed",
          description: error.message || "We've saved your email, but couldn't record your feedback. We'll follow up with you directly.",
          variant: "destructive",
        });
      }
    }
  };

  const updateQuizData = (field: keyof QuizData, value: string) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  const quizQuestions = [
    {
      question: "What's the single most frustrating part of your job search right now?",
      field: "frustration" as keyof QuizData,
      type: "textarea"
    },
    {
      question: "If you could have an AI career coach, what is the first thing you would ask it for help with?",
      field: "aiCoachHelp" as keyof QuizData,
      type: "textarea"
    },
    {
      question: "When preparing for technical interviews, which area do you feel least confident in?",
      field: "confidenceArea" as keyof QuizData,
      type: "radio",
      options: [
        "Data Structures & Algorithms",
        "System Design",
        "Explaining Your Thought Process",
        "Company-Specific Questions"
      ]
    },
    {
      question: "Is there anything else you'd love to see in a job preparation platform?",
      field: "additionalFeatures" as keyof QuizData,
      type: "textarea",
      optional: true
    }
  ];

  return (
    <section 
      id="conversion"
      ref={sectionRef}
      className="py-20 relative z-10"
    >
      <div className="container mx-auto px-6">
        <div className={`transition-all duration-1000 ${isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}>
          {!showQuiz ? (
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-off-white mb-8">
                Be the First to{' '}
                <span className="text-vibrant-gold">Know.</span>
              </h2>
              
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-charcoal border-medium-gray text-off-white placeholder:text-medium-gray text-lg py-6 pr-12"
                  />
                  {isValidEmail && (
                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-success-green w-5 h-5" />
                  )}
                </div>
                
                <Button 
                  type="submit"
                  disabled={!isValidEmail || isSubmitting}
                  className="w-full bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 text-lg py-6 font-semibold glow-hover disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Securing Your Spot...
                    </>
                  ) : (
                    'Secure My Spot'
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-off-white mb-4">
                  You're in! Help us build the perfect platform for{' '}
                  <span className="text-vibrant-gold">you.</span>
                </h2>
                <div className="flex justify-center space-x-2 mb-6">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full ${
                        step <= currentQuizStep ? 'bg-vibrant-gold' : 'bg-medium-gray/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-charcoal/50 border border-medium-gray/20 rounded-lg p-8">
                <h3 className="text-xl font-semibold text-off-white mb-6">
                  {quizQuestions[currentQuizStep].question}
                  {quizQuestions[currentQuizStep].optional && (
                    <span className="text-medium-gray text-base ml-2">(Optional)</span>
                  )}
                </h3>

                {quizQuestions[currentQuizStep].type === 'textarea' ? (
                  <Textarea
                    value={quizData[quizQuestions[currentQuizStep].field]}
                    onChange={(e) => updateQuizData(quizQuestions[currentQuizStep].field, e.target.value)}
                    className="bg-charcoal border-medium-gray text-off-white placeholder:text-medium-gray min-h-[120px] mb-6"
                    placeholder="Share your thoughts..."
                  />
                ) : (
                  <RadioGroup
                    value={quizData[quizQuestions[currentQuizStep].field]}
                    onValueChange={(value) => updateQuizData(quizQuestions[currentQuizStep].field, value)}
                    className="space-y-4 mb-6"
                  >
                    {quizQuestions[currentQuizStep].options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="text-off-white cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                <Button 
                  onClick={handleQuizNext}
                  disabled={!quizData[quizQuestions[currentQuizStep].field] && !quizQuestions[currentQuizStep].optional}
                  className="w-full bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 font-semibold glow-hover"
                >
                  {currentQuizStep === 3 ? 'Complete' : 'Next'}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mt-16">
            <p className="text-medium-gray mb-4">Follow our journey</p>
            <div className="flex justify-center space-x-6">
              <a href="https://www.linkedin.com/company/thetruthschool/" className="text-muted-gold hover:text-vibrant-gold transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
              <a href="https://www.instagram.com/thetruthschool_motivation/" className="text-muted-gold hover:text-vibrant-gold transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@TheTruthSchool" className="text-muted-gold hover:text-vibrant-gold transition-colors">
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

