import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RedirectCountdownProps {
  email: string;
  seconds?: number;
}

const RedirectCountdown = ({ email, seconds = 5 }: RedirectCountdownProps) => {
  const [countdown, setCountdown] = useState(seconds);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/newsletter?email=${encodeURIComponent(email)}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  return (
    <div className="bg-charcoal/50 border border-medium-gray/20 rounded-lg p-6 mb-8">
      <div className="text-center">
        <div className="text-vibrant-gold text-3xl font-bold mb-2">
          {countdown}
        </div>
        <p className="text-medium-gray">
          Redirecting to newsletter signup...
        </p>
      </div>
    </div>
  );
};

export default RedirectCountdown;