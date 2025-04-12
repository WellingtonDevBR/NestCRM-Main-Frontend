import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PaymentService } from "@/services/paymentService";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionData } from "@/domain/auth/types";

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
              console.log('Verifying checkout session:', sessionId);
              
              // Verify session with Stripe
              const subscriptionData = await PaymentService.verifyCheckoutSession(sessionId);
              
              // If we got valid data from Stripe
              if (subscriptionData && subscriptionData.stripeSubscriptionId) {
                console.log('Retrieved subscription data from Stripe:', subscriptionData);

                // Update stored data with the Stripe details
                const enhancedSignupData = {
                  ...pendingData.signupData,
                  subscription: {
                    ...pendingData.signupData.subscription,
                    stripeSessionId: sessionId,
                    stripeSubscriptionId: subscriptionData.stripeSubscriptionId,
                    stripeCustomerId: subscriptionData.stripeCustomerId,
                    stripePriceId: subscriptionData.stripePriceId,
                    stripeProductId: subscriptionData.stripeProductId,
                    currency: subscriptionData.currency || pendingData.signupData.subscription?.currency || 'AUD',
                    interval: subscriptionData.interval || pendingData.signupData.subscription?.interval || 'month',
                    amount: subscriptionData.amount || pendingData.signupData.subscription?.amount || 0
                  }
                };
                
                // Store the enhanced signup data
                PaymentService.storeSignupData(enhancedSignupData, pendingData.planId);
              } else {
                console.warn('No subscription data retrieved from Stripe, using fallback data');
                
                // Make sure we have a valid subscription object with default values for required fields
                const existingSubscription = pendingData.signupData.subscription || {};
                const plan = PaymentService.getPlanById(pendingData.planId);
                
                const enhancedSignupData = {
                  ...pendingData.signupData,
                  subscription: {
                    ...existingSubscription,
                    planId: pendingData.planId,
                    currency: plan?.currency || 'AUD',
                    interval: plan?.interval || 'month',
                    amount: plan?.priceValue || 0,
                    trialDays: plan?.trialDays || 0,
                    status: 'trialing' as 'trialing',
                    stripeSessionId: sessionId || '',
                    // Keep any existing IDs if available or set as empty strings
                    stripeSubscriptionId: existingSubscription.stripeSubscriptionId || '',
                    stripeCustomerId: existingSubscription.stripeCustomerId || '',
                    stripePriceId: existingSubscription.stripePriceId || '',
                    stripeProductId: existingSubscription.stripeProductId || ''
                  }
                };
                
                // Store the enhanced data
                PaymentService.storeSignupData(enhancedSignupData, pendingData.planId);
              }
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
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-lg border-green-100">
          <CardHeader className="pb-4 text-center border-b border-green-100">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Your payment has been processed. We're now setting up your account.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll be redirected automatically...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button onClick={() => navigate('/')} variant="outline">Return to Homepage</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (status === 'cancelled') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardHeader className="pb-4 text-center border-b border-red-100">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <X className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">
              Your payment was cancelled. You can try again or choose a different plan.
            </p>
            <p className="text-sm text-muted-foreground">
              You'll be redirected to signup automatically...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Button onClick={() => navigate('/signup')}>Return to Signup</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-lg border-blue-100">
          <CardHeader className="pb-4 text-center border-b border-blue-100">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">Processing Payment</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              We're confirming your payment details. Please wait a moment...
            </p>
          </CardContent>
        </Card>
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
