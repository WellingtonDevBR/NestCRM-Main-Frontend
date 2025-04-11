import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentService } from "@/services/paymentService";

const PaymentResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState<'success' | 'cancelled' | 'processing' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const processPaymentResult = async () => {
      // Determine result type from path
      if (location.pathname.includes('payment-success')) {
        setStatus('processing');
        
        // Get session ID from URL if available
        const urlParams = new URLSearchParams(location.search);
        const sessionId = urlParams.get('session_id');
        
        // Get stored signup data
        const pendingData = PaymentService.getStoredSignupData();
        if (pendingData) {
          try {
            if (sessionId) {
              // Verify payment status with edge function if needed
              // This could be added in the future
            }
            
            setStatus('success');
            // After short delay, redirect to signup with success parameter
            setTimeout(() => {
              navigate('/signup?payment_status=success');
            }, 2000);
          } catch (error) {
            console.error('Error verifying payment:', error);
            navigate('/signup?payment_status=error');
          }
        } else {
          // If no pending data, just show success but don't redirect to signup
          setStatus('success');
          setIsLoading(false);
        }
      } else if (location.pathname.includes('payment-canceled')) {
        setStatus('cancelled');
        setIsLoading(false);
        
        // After short delay, redirect to signup with cancelled parameter
        setTimeout(() => {
          navigate('/signup?payment_status=cancelled');
        }, 2000);
      }
    };
    
    processPaymentResult();
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
          <p className="text-sm text-muted-foreground mb-4">
            You'll be redirected automatically...
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/')} variant="outline">Return to Homepage</Button>
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
          <p className="text-sm text-muted-foreground mb-4">
            You'll be redirected to signup automatically...
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/signup')}>Return to Signup</Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Processing Payment</h1>
          <p className="text-muted-foreground mb-6">
            We're confirming your payment details. Please wait a moment...
          </p>
        </div>
      </div>
    );
  }
  
  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-lg">Processing payment result...</p>
      </div>
    </div>
  );
};

export default PaymentResult;
