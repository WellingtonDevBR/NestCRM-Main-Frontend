
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { SignUpData } from "@/domain/auth/types";
import { Plan, plans } from "@/components/auth/form/plan/planData";

export class PaymentService {
  /**
   * Create a checkout session for a paid plan subscription
   */
  static async createCheckoutSession(
    signupData: SignUpData, 
    selectedPlan: Plan
  ): Promise<string | null> {
    try {
      console.log('Creating checkout session for plan:', selectedPlan);
      
      // Call our Supabase Edge Function to create a checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { planId: selectedPlan.id, signupData }
      });
      
      if (error) {
        console.error('Error invoking create-checkout-session:', error);
        throw new Error(error.message);
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
   * Get trial information
   */
  static getTrialInfo(): {
    planId: string;
    productId: string;
    trialStartDate: string;
    trialEndDate: string;
    daysRemaining: number;
  } | null {
    const trialData = localStorage.getItem('trial_info');
    
    if (!trialData) return null;
    
    try {
      const trial = JSON.parse(trialData);
      const now = new Date();
      const endDate = new Date(trial.trialEndDate);
      const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      return {
        ...trial,
        daysRemaining
      };
    } catch (e) {
      console.error('Error parsing trial info:', e);
      return null;
    }
  }

  /**
   * Check if the trial has expired
   */
  static isTrialExpired(): boolean {
    const trial = this.getTrialInfo();
    if (!trial) return true;
    
    const now = new Date();
    const endDate = new Date(trial.trialEndDate);
    
    return now > endDate;
  }
  
  /**
   * Store trial information
   */
  static storeTrialInfo(planId: string, productId: string, trialDays: number): void {
    const trialInfo = {
      planId,
      productId,
      trialStartDate: new Date().toISOString(),
      trialEndDate: new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toISOString()
    };
    
    localStorage.setItem('trial_info', JSON.stringify(trialInfo));
  }
  
  /**
   * Get a plan by ID
   */
  static getPlanById(planId: string): Plan | undefined {
    return plans.find(p => p.id === planId);
  }
}
