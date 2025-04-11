
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSignupFormState } from "@/hooks/useSignupFormState";
import { useSignupProgress } from "@/hooks/useSignupProgress";
import { useSignupPayment } from "@/hooks/useSignupPayment";
import { useSubdomainSuggestion } from "@/hooks/signup/useSubdomainSuggestion";
import { useSignupFormSubmission } from "@/hooks/signup/useSignupFormSubmission";
import { useSignupCompletion } from "@/hooks/signup/useSignupCompletion";
import { usePaymentStatusCheck } from "@/hooks/signup/usePaymentStatusCheck";
import { toast } from "sonner";

export const useSignupForm = () => {
  const { signUp } = useAuth();
  const formState = useSignupFormState();
  const {
    setupProgress,
    setupStage,
    showSetupProgress,
    setShowSetupProgress,
    startProgressSimulation,
    setSetupStage
  } = useSignupProgress();
  const {
    handlePlanSelection,
    checkPaymentStatus,
    getStoredSignupData,
    clearStoredSignupData,
  } = useSignupPayment();

  // Destructure form state for easier access
  const {
    isLoading, setIsLoading,
    errorMessage, setErrorMessage,
    signupStage, setSignupStage,
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    companyName, setCompanyName,
    subdomain, setSubdomain,
    setFormDataFromStored, getFormData
  } = formState;

  // Use the subdomain suggestion hook
  useSubdomainSuggestion({
    email,
    companyName,
    subdomain,
    setCompanyName,
    setSubdomain
  });

  // Use the form submission hook
  const { handleFormSubmit } = useSignupFormSubmission({
    subdomain,
    setErrorMessage,
    setSignupStage
  });

  // Use the signup completion hook
  const { completeSignup } = useSignupCompletion({
    signUp,
    setSignupStage,
    setIsLoading,
    setErrorMessage,
    setShowSetupProgress,
    setSetupStage,
    startProgressSimulation
  });

  // Use the payment status check hook
  usePaymentStatusCheck({
    checkPaymentStatus,
    getStoredSignupData,
    clearStoredSignupData,
    completeSignup,
    setFormDataFromStored,
    setSignupStage
  });

  const handlePlanSelected = async (planId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const signupData = getFormData();
      
      setSignupStage("processing");
      console.log(`Plan ${planId} selected, proceeding with signup`);
      
      // For both free and paid plans, use the handlePlanSelection function
      // which will either create a trial account directly or redirect to Stripe
      const result = await handlePlanSelection(signupData, planId);
      
      if (result.success) {
        if (result.redirectUrl) {
          // Redirect to Stripe checkout for paid plans
          console.log("Redirecting to Stripe checkout:", result.redirectUrl);
          window.location.href = result.redirectUrl;
          return;
        }
        // If successful without redirect, free plan/trial was processed directly
        console.log("Free trial plan processed successfully");
      } else if (result.error) {
        throw result.error;
      }
    } catch (error: any) {
      console.error("Plan selection error:", error);
      const errorMsg = error.message || "There was an error processing your plan selection.";
      setErrorMessage(errorMsg);
      toast.error("Plan Selection Error", {
        description: errorMsg
      });
      setIsLoading(false);
      setSignupStage("plan_selection");
    }
  };

  return {
    // State
    isLoading,
    errorMessage,
    signupStage,
    setupProgress,
    setupStage,
    showSetupProgress,

    // Form data
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    companyName,
    setCompanyName,
    subdomain,
    setSubdomain,

    // Event handlers
    handleFormSubmit,
    handlePlanSelected,
    completeSignup
  };
};
