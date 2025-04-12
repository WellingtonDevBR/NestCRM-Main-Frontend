
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SignUpData, SubscriptionData } from "@/domain/auth/types";
import { Plan, plans } from "@/components/auth/form/plan/planData";
import { priceToCents } from "@/utils/currencyUtils";

export class PaymentService {
  /**
   * Create a checkout session for a subscription
   */
  static async createCheckoutSession(
    signupData: SignUpData, 
    selectedPlan: Plan
  ): Promise<string | null> {
    try {
      console.log('Creating checkout session for plan:', selectedPlan);
      
      // Call our Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          planId: selectedPlan.id, 
          signupData: {
            ...signupData,
            currency: selectedPlan.currency // Pass the currency to the edge function
          }
        }
      });
      
      if (error) {
        console.error('Error invoking create-checkout-session:', error);
        throw new Error(error.message || 'Failed to create checkout session');
      }
      
      if (!data || !data.url) {
        console.error('Invalid response from create-checkout-session:', data);
        throw new Error('Invalid response from checkout session');
      }
      
      // Store the stripe session ID and other IDs
      if (data.sessionId || data.priceId || data.productId) {
        // Create a valid subscription object with required fields
        const subscriptionData: SubscriptionData = {
          planId: selectedPlan.id,
          currency: selectedPlan.currency || 'AUD',
          interval: selectedPlan.interval || 'month',
          amount: selectedPlan.priceValue || 0,
          trialDays: selectedPlan.trialDays || 0,
          status: 'trialing',
          stripeSessionId: data.sessionId || '',
          stripePriceId: data.priceId,
          stripeProductId: data.productId
        };
        
        const enhancedSignupData = {
          ...signupData,
          subscription: subscriptionData
        };
        
        // Store the enhanced data
        this.storeSignupData(enhancedSignupData, selectedPlan.id);
      }
      
      return data.url;
    } catch (error: any) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session', {
        description: error.message || 'Please try again later',
      });
      throw error;
    }
  }

  /**
   * Verify subscription details from a successful checkout
   */
  static async verifyCheckoutSession(sessionId: string): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase.functions.invoke('check-trial-status', {
        body: { session_id: sessionId }
      });
      
      if (error) {
        console.error('Error verifying checkout session:', error);
        return null;
      }
      
      if (!data.active) {
        return null;
      }
      
      // Return subscription data with Stripe IDs
      return {
        planId: data.planId || '',
        currency: data.currency || 'AUD',
        interval: data.interval || 'month',
        amount: data.amount || 0,
        trialDays: data.trial_end ? 
          Math.round((new Date(data.trial_end).getTime() - new Date(data.trial_start).getTime()) / (24*60*60*1000)) : 
          0,
        trialEndsAt: data.trial_end,
        status: data.status || 'trialing',
        stripeSubscriptionId: data.subscription_id,
        stripeCustomerId: data.customer_id
      };
    } catch (error) {
      console.error('Error verifying subscription:', error);
      return null;
    }
  }

  /**
   * Store signup data in local storage for retrieval after payment flow
   */
  static storeSignupData(signupData: SignUpData, planId: string): void {
    localStorage.setItem('pending_signup', JSON.stringify({
      signupData,
      planId,
      timestamp: Date.now()
    }));
  }
  
  /**
   * Retrieve stored signup data after returning from payment flow
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
   * Clear stored signup data
   */
  static clearStoredSignupData(): void {
    localStorage.removeItem('pending_signup');
  }

  /**
   * Get a plan by ID
   */
  static getPlanById(planId: string): Plan | undefined {
    return plans.find(p => p.id === planId);
  }
}
