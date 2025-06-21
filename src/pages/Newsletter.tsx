import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, Mail, Bell, TrendingUp, Users, ArrowLeft } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Footer from "@/components/Footer";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [preferences, setPreferences] = useState({
    weekly_updates: true,
    product_updates: true,
    career_tips: true
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Pre-fill email if coming from feedback form
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setEmail(emailFromParams);
    }
  }, [searchParams]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(emailRegex.test(email));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          preferences 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      
      setIsSubscribed(true);
      
      toast({
        title: "Welcome to our community!",
        description: data.message || "You're now subscribed to TheTruthSchool updates.",
      });
    } catch (error: any) {
      console.error('Error subscribing:', error);
      
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again or contact us if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isSubscribed) {
    return (
      <div className="min-h-screen bg-charcoal text-off-white relative overflow-x-hidden flex items-center justify-center">
        <BackgroundAnimation />
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-vibrant-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-charcoal" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-off-white mb-6">
              You're All Set! 🎉
            </h1>
            
            <p className="text-xl text-medium-gray mb-8 leading-relaxed">
              Welcome to TheTruthSchool community! You'll receive our latest insights, 
              career tips, and product updates directly in your inbox.
            </p>
            
            <div className="bg-charcoal/50 border border-medium-gray/20 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-vibrant-gold mb-4">What's Next?</h3>
              <ul className="text-left space-y-3 text-medium-gray">
                <li className="flex items-center">
                  <Mail className="w-5 h-5 text-muted-gold mr-3" />
                  Check your email for a welcome message
                </li>
                <li className="flex items-center">
                  <Bell className="w-5 h-5 text-muted-gold mr-3" />
                  You'll get weekly career insights and tips
                </li>
                <li className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-muted-gold mr-3" />
                  Be first to know about new features and updates
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/')}
                className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 font-semibold glow-hover"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                onClick={() => navigate('/blog')}
                variant="outline"
                className="border-vibrant-gold text-vibrant-gold hover:bg-vibrant-gold hover:text-charcoal"
              >
                Read Our Blog
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-off-white relative overflow-x-hidden">
      <BackgroundAnimation />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-vibrant-gold rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-charcoal" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-off-white mb-4">
              Stay in the{' '}
              <span className="text-vibrant-gold">Loop</span>
            </h1>
            
            <p className="text-xl text-medium-gray leading-relaxed">
              Get exclusive career insights, interview tips, and be the first to know 
              when TheTruthSchool launches. Join our community of ambitious professionals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-charcoal border-medium-gray text-off-white placeholder:text-medium-gray text-lg py-6 pr-12"
              />
              {isValidEmail && (
                <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-success-green w-5 h-5" />
              )}
            </div>

            <div className="bg-charcoal/50 border border-medium-gray/20 rounded-lg p-6 text-left">
              <h3 className="text-lg font-semibold text-off-white mb-4">
                What would you like to receive?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="weekly"
                    checked={preferences.weekly_updates}
                    onCheckedChange={() => handlePreferenceChange('weekly_updates')}
                  />
                  <label htmlFor="weekly" className="text-off-white cursor-pointer flex-1">
                    <div className="font-medium">Weekly Career Insights</div>
                    <div className="text-sm text-medium-gray">Job market trends, salary insights, and career advice</div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="product"
                    checked={preferences.product_updates}
                    onCheckedChange={() => handlePreferenceChange('product_updates')}
                  />
                  <label htmlFor="product" className="text-off-white cursor-pointer flex-1">
                    <div className="font-medium">Product Updates</div>
                    <div className="text-sm text-medium-gray">New features, beta access, and platform announcements</div>
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="tips"
                    checked={preferences.career_tips}
                    onCheckedChange={() => handlePreferenceChange('career_tips')}
                  />
                  <label htmlFor="tips" className="text-off-white cursor-pointer flex-1">
                    <div className="font-medium">Interview & Resume Tips</div>
                    <div className="text-sm text-medium-gray">Actionable advice from industry experts and hiring managers</div>
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              type="submit"
              disabled={!isValidEmail || isSubmitting}
              className="w-full bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 text-lg py-6 font-semibold glow-hover disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Users className="mr-2 h-4 w-4 animate-spin" />
                  Joining Community...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Join TheTruthSchool Community
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-medium-gray">
              We respect your privacy. Unsubscribe at any time.
            </p>
            <Button 
              variant="ghost"
              onClick={() => navigate('/')}
              className="mt-4 text-muted-gold hover:text-gray-900 font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Newsletter;