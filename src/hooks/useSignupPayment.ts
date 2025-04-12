
import { toast } from "sonner";
import { PaymentService } from "@/services/paymentService";
import { SignUpData, SubscriptionData } from "@/domain/auth/types";
import { authService } from "@/services/authService";
import { currencies, DEFAULT_CURRENCY } from "@/utils/currencyUtils";

export const useSignupPayment = () => {
  const handlePlanSelection = async (
    signupData: SignUpData, 
    planId: string
  ): Promise<{success: boolean, redirectUrl?: string, error?: Error}> => {
    try {
      const selectedPlan = PaymentService.getPlanById(planId);
      if (!selectedPlan) {
        throw new Error("Invalid plan selected");
      }

      console.log('Selected plan:', selectedPlan);

      // Get currency from plan or use default
      const currency = selectedPlan.currency || DEFAULT_CURRENCY;
      
      // Create subscription data to send to backend
      const subscriptionData: SubscriptionData = {
        planId: selectedPlan.id,
        currency: currency,
        interval: selectedPlan.interval || 'month',
        amount: selectedPlan.priceValue,
        trialDays: selectedPlan.trialDays,
        status: 'trialing',
        // Initialize Stripe IDs as empty strings since we don't have them yet
        stripeSessionId: '',
        stripeSubscriptionId: '',
        stripeCustomerId: '',
        stripePriceId: '',
        stripeProductId: ''
      };
      
      // Add subscription data to signup data
      const enhancedSignupData = {
        ...signupData,
        planId,
        currency,
        subscription: subscriptionData
      };

      // For all plans (including trials), create a checkout session
      const checkoutUrl = await PaymentService.createCheckoutSession(enhancedSignupData, selectedPlan);

      if (checkoutUrl) {
        // Store signup data for retrieval after payment
        PaymentService.storeSignupData(enhancedSignupData, planId);
        return { success: true, redirectUrl: checkoutUrl };
      } else {
        throw new Error("Could not create checkout session");
      }
    } catch (error: any) {
      console.error("Plan selection error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error : new Error(error?.message || "Unknown error") 
      };
    }
  };

  const checkPaymentStatus = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('payment_status')) {
      return urlParams.get('payment_status');
    }
    return null;
  };

  const getStoredSignupData = () => {
    return PaymentService.getStoredSignupData();
  };

  const clearStoredSignupData = () => {
    PaymentService.clearStoredSignupData();
  };

  return {
    handlePlanSelection,
    checkPaymentStatus,
    getStoredSignupData,
    clearStoredSignupData
  };
};
