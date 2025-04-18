
import { Plan, plans } from "@/components/auth/form/plan/planData";
import { SignUpData } from "@/domain/auth/types";

export class StripeService {
  /**
   * Get a plan by ID
   */
  static getPlanById(planId: string): Plan | undefined {
    return plans.find(p => p.id === planId);
  }
  
  /**
   * Creates a checkout session for the selected plan
   * @deprecated Use PaymentService.createCheckoutSession instead
   */
  static async createCheckoutSession(signupData: SignUpData, plan: Plan): Promise<string | null> {
    console.warn('StripeService.createCheckoutSession is deprecated, use PaymentService.createCheckoutSession instead');
    return null;
  }
  
  /**
   * Stores the signup and subscription data before redirecting to Stripe
   * @deprecated Use PaymentService.storeSignupData instead
   */
  static storeSignupData(signupData: SignUpData, planId: string): void {
    console.warn('StripeService.storeSignupData is deprecated, use PaymentService.storeSignupData instead');
    localStorage.setItem('pending_signup', JSON.stringify({
      signupData,
      planId,
      timestamp: Date.now()
    }));
  }
  
  /**
   * Retrieves stored signup data after returning from Stripe
   * @deprecated Use PaymentService.getStoredSignupData instead
   */
  static getStoredSignupData(): { signupData: SignUpData; planId: string } | null {
    console.warn('StripeService.getStoredSignupData is deprecated, use PaymentService.getStoredSignupData instead');
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
   * @deprecated Use PaymentService.clearStoredSignupData instead
   */
  static clearStoredSignupData(): void {
    console.warn('StripeService.clearStoredSignupData is deprecated, use PaymentService.clearStoredSignupData instead');
    localStorage.removeItem('pending_signup');
  }

  /**
   * Get trial information for the user
   * @deprecated Use PaymentService.getTrialInfo instead
   */
  static getTrialInfo(): {
    planId: string;
    productId: string;
    trialStartDate: string;
    trialEndDate: string;
    daysRemaining: number;
  } | null {
    console.warn('StripeService.getTrialInfo is deprecated, use PaymentService.getTrialInfo instead');
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
   * Check if the trial period has ended
   * @deprecated Use PaymentService.isTrialExpired instead
   */
  static isTrialExpired(): boolean {
    console.warn('StripeService.isTrialExpired is deprecated, use PaymentService.isTrialExpired instead');
    const trial = this.getTrialInfo();
    if (!trial) return true;
    
    const now = new Date();
    const endDate = new Date(trial.trialEndDate);
    
    return now > endDate;
  }
}
