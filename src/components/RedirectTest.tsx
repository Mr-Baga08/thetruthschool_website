import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Add this component temporarily to your homepage to test navigation
const RedirectTest = () => {
  const navigate = useNavigate();

  const testRedirect = () => {
    console.log("Testing redirect...");
    try {
      navigate('/newsletter?email=test@example.com');
      console.log("Navigation called successfully");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  const testWindowRedirect = () => {
    console.log("Testing window redirect...");
    window.location.href = '/newsletter?email=test@example.com';
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      <Button onClick={testRedirect} className="bg-red-500 text-white">
        Test Navigate
      </Button>
      <Button onClick={testWindowRedirect} className="bg-blue-500 text-white">
        Test Window
      </Button>
    </div>
  );
};

export default RedirectTest;