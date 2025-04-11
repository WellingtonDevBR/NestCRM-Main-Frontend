
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthResult } from "@/domain/auth/types";
import { useSignupFormState } from "@/hooks/useSignupFormState";
import { useSignupProgress } from "@/hooks/useSignupProgress";
import { useSignupPayment } from "@/hooks/useSignupPayment";

export const useSignupForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
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

  useEffect(() => {
    // Check payment status when component mounts
    const status = checkPaymentStatus();
    if (status) {
      const storedData = getStoredSignupData();
      if (storedData) {
        if (status === 'success') {
          completeSignup(storedData.signupData, storedData.planId);
        } else {
          toast.error("Payment was not completed", {
            description: "You can try again or choose a different plan"
          });
          setFormDataFromStored(storedData.signupData);
          setSignupStage("plan_selection");
        }
        clearStoredSignupData();
      }
    }
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      setSignupStage("plan_selection");
    } catch (error: any) {
      console.error("Form submission error:", error);
      const errorMsg = "There was an error processing your information. Please try again.";
      setErrorMessage(errorMsg);
      toast.error("Form Submission Error", {
        description: errorMsg
      });
    }
  };

  const handlePlanSelected = async (planId: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const signupData = getFormData();
      
      const result = await handlePlanSelection(signupData, planId);
      
      if (result.success) {
        if (result.redirectUrl) {
          // Redirect to Stripe checkout
          window.location.href = result.redirectUrl;
          return;
        }
        // If successful without redirect, plan was a free trial
        setSignupStage("processing");
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
    }
  };

  const completeSignup = async (signupData: any, planId: string) => {
    setSignupStage("processing");
    setIsLoading(true);
    setErrorMessage(null);

    try {
      setSetupStage("Creating your account...");
      startProgressSimulation();

      console.log('Completing signup with data:', { signupData, planId });

      const finalSignupData = {
        ...signupData,
        planId
      };

      // If not using Supabase directly for signup, continue with external API
      const result: AuthResult = await signUp(finalSignupData);

      if (result.success && result.session) {
        toast.success("Account created successfully!");
        redirectToTenantDomain(result.session.tenant);
      } else {
        setShowSetupProgress(false);
        const errorMsg = result.error?.message || "Please try again later.";
        setErrorMessage(errorMsg);
        toast.error("Failed to create account", {
          description: errorMsg
        });
        setIsLoading(false);
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
