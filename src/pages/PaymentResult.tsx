
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StripeService } from "@/services/stripeService";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'cancelled' | null>(null);
  
  useEffect(() => {
    // Determine result type from path
    if (location.pathname.includes('payment-success')) {
      setStatus('success');
    } else if (location.pathname.includes('payment-canceled')) {
      setStatus('cancelled');
    }
    
    // If success, check for pending signup data
    if (location.pathname.includes('payment-success')) {
      const pendingData = StripeService.getStoredSignupData();
      if (pendingData) {
        // Redirect to signup with success parameter
        navigate('/signup?payment_status=success');
      }
    } else if (location.pathname.includes('payment-canceled')) {
      navigate('/signup?payment_status=cancelled');
    }
  }, [location, navigate]);
  
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Your payment has been processed. We're now setting up your account.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/')}>Return to Homepage</Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Cancelled</h1>
          <p className="text-muted-foreground mb-6">
            Your payment was cancelled. You can try again or choose a different plan.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/signup')}>Return to Signup</Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-lg">Processing payment result...</p>
      </div>
    </div>
  );
};

export default PaymentResult;
