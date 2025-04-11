
import { toast } from "sonner";
import { PaymentService } from "@/services/paymentService";
import { SignUpData } from "@/domain/auth/types";
import { supabase } from "@/integrations/supabase/client";

export const useSignupPayment = () => {
  const createTrialAccount = async (signupData: SignUpData, planId: string): Promise<boolean> => {
    try {
      // For the starter plan (free trial), we'll bypass the external API and use Supabase directly
      const selectedPlan = PaymentService.getPlanById(planId);
      if (selectedPlan?.trial) {
        // Store trial information
        PaymentService.storeTrialInfo(
          planId, 
          selectedPlan.productId, 
          selectedPlan.trialDays || 14
        );

        // Implement direct Supabase registration
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: signupData.email,
          password: signupData.password,
          options: {
            data: {
              first_name: signupData.firstName,
              last_name: signupData.lastName,
              company_name: signupData.companyName,
              subdomain: signupData.subdomain,
              plan_id: planId
            }
          }
        });

        if (authError) throw authError;

        toast.success("Account created successfully!");
        
        // Redirect to dashboard after successful signup
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error creating trial account:", error);
      throw error;
    }
  };

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

      // For free plan or trial, create account directly
      if (selectedPlan.priceValue === 0 || selectedPlan.trial) {
        const success = await createTrialAccount(signupData, planId);
        return { success };
      }

      // For paid plans, create a checkout session
      const checkoutUrl = await PaymentService.createCheckoutSession(signupData, selectedPlan);

      if (checkoutUrl) {
        // Store signup data for retrieval after payment
        PaymentService.storeSignupData(signupData, planId);
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
    clearStoredSignupData,
    createTrialAccount
  };
};
