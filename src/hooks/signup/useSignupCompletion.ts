
import { useState } from "react";
import { toast } from "sonner";
import { useTenantStatusPolling } from "./useTenantStatusPolling";
import { AuthResult } from "@/domain/auth/types";
import { SignupStep } from "@/components/auth/form/StepIndicator";

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
        planId 
      });

      const finalSignupData = {
        ...signupData,
        planId
      };

      // Use the external API for consistent tenant provisioning
      const result: AuthResult = await signUp(finalSignupData);

      if (result.success && result.session) {
        toast.success("Account created successfully!");
        
        // Handle redirection to tenant domain
        if (result.session.tenant && result.session.tenant.domain) {
          // Log the tenant information for debugging
          console.log('Tenant information for redirect:', result.session.tenant);
          
          // Wait for tenant to be ready before redirecting
          const tenantDomain = result.session.tenant.domain;
          setSetupStage("Setting up your workspace...");
          
          // Show a loading toast before starting to poll
          toast.loading("Preparing your workspace - this may take a minute...");
          
          // Poll for tenant status with improved reliability
          const isReady = await pollTenantStatus(tenantDomain);
          
          if (isReady) {
            console.log('Tenant domain is ready, proceeding with redirect');
            // Success toast before redirect
            toast.success("Your workspace is ready!");
            
            // Use direct navigation for consistent redirection
            const protocol = window.location.protocol;
            const url = `${protocol}//${tenantDomain}/dashboard`;
            console.log('Redirecting to tenant URL:', url);
            
            // Use setTimeout to ensure cookies are properly set before redirecting
            setTimeout(() => {
              console.log('Executing redirect to:', url);
              // Use window.location.replace for a cleaner redirect
              window.location.replace(url);
            }, 1500);
          } else {
            // Even if polling timed out, still try to redirect
            console.log('Tenant polling timed out, attempting redirect anyway');
            const protocol = window.location.protocol;
            const url = `${protocol}//${tenantDomain}/dashboard`;
            
            toast.loading("Your workspace is still being set up. Redirecting you now...");
            setTimeout(() => {
              window.location.replace(url);
            }, 2000);
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
