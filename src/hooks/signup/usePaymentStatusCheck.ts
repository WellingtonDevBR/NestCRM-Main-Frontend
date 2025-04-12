
import { useEffect } from "react";
import { toast } from "sonner";
import { SubscriptionData, SignUpData } from "@/domain/auth/types";

interface UsePaymentStatusCheckProps {
  checkPaymentStatus: () => string | null;
  getStoredSignupData: () => any;
  clearStoredSignupData: () => void;
  completeSignup: (signupData: any, planId: string) => Promise<void>;
  setFormDataFromStored: (data: any) => void;
  setSignupStage: (stage: any) => void;
}

export const usePaymentStatusCheck = ({
  checkPaymentStatus,
  getStoredSignupData,
  clearStoredSignupData,
  completeSignup,
  setFormDataFromStored,
  setSignupStage
}: UsePaymentStatusCheckProps) => {
  useEffect(() => {
    const paymentStatus = checkPaymentStatus();
    
    if (paymentStatus) {
      const storedData = getStoredSignupData();
      
      if (storedData) {
        // Set the form data from stored data
        setFormDataFromStored(storedData.signupData);
        
        if (paymentStatus === 'success') {
          // Get the session ID from URL if available
          const urlParams = new URLSearchParams(window.location.search);
          const sessionId = urlParams.get('session_id');
          
          if (sessionId && storedData.signupData) {
            console.log('Processing successful payment with session ID:', sessionId);
            
            // Get the current subscription data or create a new one
            const existingSubscription = storedData.signupData.subscription || {} as Partial<SubscriptionData>;
            
            // Create a valid subscription object with all required fields
            const subscription: SubscriptionData = {
              planId: existingSubscription.planId || storedData.planId,
              currency: existingSubscription.currency || 'AUD',
              interval: existingSubscription.interval || 'month',
              amount: existingSubscription.amount || 0,
              trialDays: existingSubscription.trialDays || 0,
              status: 'trialing',
              stripeSessionId: sessionId,
              stripeSubscriptionId: existingSubscription.stripeSubscriptionId || '',
              stripeCustomerId: existingSubscription.stripeCustomerId || '',
              stripePriceId: existingSubscription.stripePriceId || '',
              stripeProductId: existingSubscription.stripeProductId || ''
            };
            
            console.log('Completed subscription object:', subscription);
            
            // Update the signup data with the complete subscription object
            storedData.signupData.subscription = subscription;
          }
          
          // Show success message
          toast.success('Payment processed successfully!', {
            description: 'Completing your account setup...'
          });
          
          // Complete signup with the stored data
          completeSignup(storedData.signupData, storedData.planId).then(() => {
            // Clear stored data after successful signup
            clearStoredSignupData();
          }).catch(error => {
            console.error('Error completing signup:', error);
            toast.error('Error completing signup', {
              description: error.message || 'Please try again or contact support'
            });
          });
        } else if (paymentStatus === 'cancelled') {
          // Show cancellation message
          toast.info('Payment was cancelled', {
            description: 'Please try again or select a different plan'
          });
          
          // Set the signup stage back to plan selection
          setSignupStage('plan_selection');
        } else if (paymentStatus === 'error') {
          // Show error message
          toast.error('There was a problem processing your payment', {
            description: 'Please try again or contact support'
          });
          
          // Set the signup stage back to plan selection
          setSignupStage('plan_selection');
        }
        
        // Clear payment status from URL to prevent processing again on refresh
        const url = new URL(window.location.href);
        url.searchParams.delete('payment_status');
        url.searchParams.delete('session_id');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, [
    checkPaymentStatus,
    getStoredSignupData,
    clearStoredSignupData,
    completeSignup,
    setFormDataFromStored,
    setSignupStage
  ]);
  
  return null;
};
