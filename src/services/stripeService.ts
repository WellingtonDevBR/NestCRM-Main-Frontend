
import { toast } from "sonner";
import { Plan } from "@/components/auth/form/PlanSelection";
import { SignUpData } from "@/domain/auth/types";

export class StripeService {
  /**
   * Creates a checkout session for the selected plan
   */
  static async createCheckoutSession(signupData: SignUpData, plan: Plan): Promise<string | null> {
    try {
      // In the future, this should be a call to your Supabase Edge Function
      // For now, we'll mock this behavior and just return a success
      
      // This would be the real implementation once you have an edge function:
      // const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      //   body: { signupData, planId: plan.id }
      // });
      //
      // if (error) throw new Error(error.message);
      // return data.url;
      
      console.log('Creating checkout session for:', { signupData, plan });
      
      // For free plan, no need to go to Stripe, just return null
      if (plan.priceValue === 0) {
        return null;
      }
      
      // Mock a successful checkout URL for paid plans
      // In reality, this would be the URL returned from Stripe
      return "https://checkout.stripe.com/pay/mock";
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session', {
        description: error.message || 'Please try again later',
      });
      return null;
    }
  }
  
  /**
   * Stores the signup and subscription data before redirecting to Stripe
   */
  static storeSignupData(signupData: SignUpData, planId: string): void {
    // Store signup data in localStorage to retrieve after payment
    // In a real implementation, you might want to encrypt this or use a more secure method
    localStorage.setItem('pending_signup', JSON.stringify({
      signupData,
      planId,
      timestamp: Date.now()
    }));
  }
  
  /**
   * Retrieves stored signup data after returning from Stripe
   */
  static getStoredSignupData(): { signupData: SignUpData; planId: string } | null {
    const data = localStorage.getItem('pending_signup');
    
    if (!data) return null;
    
    try {
      const parsed = JSON.parse(data);
      
      // Check if the data is too old (30 minutes)
      const now = Date.now();
      const threshold = 30 * 60 * 1000; // 30 minutes
      
      if (now - parsed.timestamp > threshold) {
        // Data is too old, remove it
        localStorage.removeItem('pending_signup');
        return null;
      }
      
      return {
        signupData: parsed.signupData,
        planId: parsed.planId
      };
    } catch (e) {
      localStorage.removeItem('pending_signup');
      return null;
    }
  }
  
  /**
   * Clears stored signup data
   */
  static clearStoredSignupData(): void {
    localStorage.removeItem('pending_signup');
  }
}
