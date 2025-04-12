
import { useState } from "react";
import { toast } from "sonner";
import { useTenantStatusPolling } from "./useTenantStatusPolling";
import { AuthResult, SubscriptionData } from "@/domain/auth/types";
import { SignupStep } from "@/components/auth/form/StepIndicator";
import { plans } from "@/components/auth/form/plan/planData";

interface UseSignupCompletionProps {
  signUp: (data: any) => Promise<AuthResult>;
  setSignupStage: (stage: SignupStep) => void;
  setIsLoading: (loading: boolean) => void;
  setErrorMessage: (error: string | null) => void;
  setShowSetupProgress: (show: boolean) => void;
  setSetupStage: (stage: string) => void;
  startProgressSimulation: () => void;
}

interface UseSignupCompletionReturn {
  completeSignup: (signupData: any, planId: string) => Promise<void>;
}

export const useSignupCompletion = ({
  signUp,
  setSignupStage,
  setIsLoading,
  setErrorMessage,
  setShowSetupProgress,
  setSetupStage,
  startProgressSimulation
}: UseSignupCompletionProps): UseSignupCompletionReturn => {
  const { pollTenantStatus } = useTenantStatusPolling();

  const completeSignup = async (signupData: any, planId: string) => {
    setSignupStage("processing");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setSetupStage("Creating your account...");
      startProgressSimulation();

      console.log('Completing signup with data:', { 
        ...signupData, 
        password: '[REDACTED]',
        planId,
        subscription: signupData.subscription ? {
          ...signupData.subscription,
          planId: signupData.subscription.planId,
          stripeSessionId: signupData.subscription.stripeSessionId || '',
          stripeSubscriptionId: signupData.subscription.stripeSubscriptionId || '',
          stripeCustomerId: signupData.subscription.stripeCustomerId || '',
          stripePriceId: signupData.subscription.stripePriceId || '',
          stripeProductId: signupData.subscription.stripeProductId || ''
        } : null
      });

      // Find the selected plan
      const selectedPlan = plans.find(plan => plan.id === planId);
      if (!selectedPlan) {
        throw new Error(`Plan with ID ${planId} not found`);
      }

      // Create final signup data with subscription information
      let finalSignupData = signupData;
      
      // If we don't already have a subscription object, create one
      if (!finalSignupData.subscription) {
        // Prepare subscription data
        const subscriptionData: SubscriptionData = {
          planId: planId,
          currency: selectedPlan.currency || 'AUD',
          interval: selectedPlan.interval || 'month',
          amount: selectedPlan.priceValue || 0,
          trialDays: selectedPlan.trialDays || 0,
          status: 'trialing',
          trialEndsAt: new Date(Date.now() + (selectedPlan.trialDays || 0) * 24 * 60 * 60 * 1000).toISOString(),
          // Initialize Stripe IDs as empty strings since we don't have them yet
          stripeSessionId: '',
          stripeSubscriptionId: '',
          stripeCustomerId: '',
          stripePriceId: '',
          stripeProductId: ''
        };
        
        finalSignupData = {
          ...signupData,
          planId,
          subscription: subscriptionData
        };
      } else {
        // Ensure all required fields exist in the subscription
        finalSignupData = {
          ...signupData,
          planId,
          subscription: {
            ...signupData.subscription,
            planId: signupData.subscription.planId || planId,
            stripeSessionId: signupData.subscription.stripeSessionId || '',
            stripeSubscriptionId: signupData.subscription.stripeSubscriptionId || '',
            stripeCustomerId: signupData.subscription.stripeCustomerId || '',
            stripePriceId: signupData.subscription.stripePriceId || '',
            stripeProductId: signupData.subscription.stripeProductId || ''
          }
        };
      }

      console.log('Final signup data with subscription:', {
        ...finalSignupData,
        password: '[REDACTED]'
      });

      // Use the external API for consistent tenant provisioning
      const result: AuthResult = await signUp(finalSignupData);

      if (result.success && result.session) {
        toast.success("Account created successfully!", {
          description: "Setting up your workspace..."
        });
        
        // Handle redirection to tenant domain
        if (result.session.tenant && result.session.tenant.domain) {
          // Log the tenant information for debugging
          console.log('Tenant information for redirect:', result.session.tenant);
          
          // Wait for tenant to be ready before redirecting
          const tenantDomain = result.session.tenant.domain;
          setSetupStage("Setting up your workspace...");
          
          // Show a more persistent loading toast
          const loadingToastId = toast.loading(
            "Preparing your workspace - this may take a minute...", 
            { duration: 60000 } // Long duration to ensure visibility
          );
          
          // Poll for tenant status with improved reliability
          try {
            const isReady = await pollTenantStatus(tenantDomain);
            
            // Dismiss the loading toast
            toast.dismiss(loadingToastId);
            
            if (isReady) {
              console.log('Tenant domain is ready, proceeding with redirect');
              
              // Success toast before redirect
              toast.success("Your workspace is ready!", {
                description: "Redirecting you now..."
              });
              
              // Use direct navigation for consistent redirection
              const protocol = window.location.protocol;
              const url = `${protocol}//${tenantDomain}/dashboard`;
              console.log('Redirecting to tenant URL:', url);
              
              // Use setTimeout to ensure cookies are properly set before redirecting
              setTimeout(() => {
                console.log('Executing redirect to:', url);
                // Use window.location.replace for a cleaner redirect
                window.location.replace(url);
              }, 1800);
            } else {
              // Even if polling timed out, still try to redirect
              console.log('Tenant polling timed out, attempting redirect anyway');
              
              toast.info("Your workspace is still being set up", {
                description: "Redirecting you now. This may take a few moments to complete setup..."
              });
              
              const protocol = window.location.protocol;
              const url = `${protocol}//${tenantDomain}/dashboard`;
              
              setTimeout(() => {
                window.location.replace(url);
              }, 2500);
            }
          } catch (error) {
            console.error("Error during tenant polling:", error);
            toast.dismiss(loadingToastId);
            
            // Still attempt redirect on error
            toast.error("There was an issue checking your workspace status", {
              description: "We'll try redirecting you anyway..."
            });
            
            const protocol = window.location.protocol;
            const url = `${protocol}//${tenantDomain}/dashboard`;
            
            setTimeout(() => {
              window.location.replace(url);
            }, 3000);
          }
          
          return;
        } else {
          console.error('Missing tenant domain in auth response', result.session);
          throw new Error('Invalid tenant information in response');
        }
      } else {
        setShowSetupProgress(false);
        const errorMsg = result.error?.message || "Please try again later.";
        setErrorMessage(errorMsg);
        toast.error("Failed to create account", {
          description: errorMsg
        });
        setIsLoading(false);
        setSignupStage("plan_selection");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setShowSetupProgress(false);
      const errorMsg = error.message || "Our services are currently unavailable. Please try again later.";
      setErrorMessage(errorMsg);
      toast.error("Failed to create account", {
        description: errorMsg
      });
      setIsLoading(false);
      setSignupStage("plan_selection");
    }
  };

  return {
    completeSignup
  };
};
