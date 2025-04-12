
import { useEffect } from "react";
import { toast } from "sonner";

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
          
          if (sessionId && storedData.signupData.subscription) {
            // Update the subscription with the session ID if not already set
            if (!storedData.signupData.subscription.stripeSessionId) {
              storedData.signupData.subscription.stripeSessionId = sessionId;
            }
          }
          
          // Show success message
          toast.success('Payment processed successfully!', {
            description: 'Completing your account setup...'
          });
          
          // Complete signup with the stored data
          completeSignup(storedData.signupData, storedData.planId).then(() => {
            // Clear stored data after successful signup
            clearStoredSignupData();
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
