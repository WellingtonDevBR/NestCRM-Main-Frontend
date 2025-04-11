
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AuthResult } from "@/domain/auth/types";
import { useSignupFormState } from "@/hooks/useSignupFormState";
import { useSignupProgress } from "@/hooks/useSignupProgress";
import { useSignupPayment } from "@/hooks/useSignupPayment";

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

  // Extract domain from email and use it for subdomain suggestion
  useEffect(() => {
    if (email && email.includes('@')) {
      const domain = email.split('@')[1];
      const suggestedSubdomain = domain.split('.')[0].toLowerCase();
      
      // Auto-populate company name if empty
      if (!companyName) {
        // Capitalize first letter of domain for company name suggestion
        const suggestedCompany = suggestedSubdomain.charAt(0).toUpperCase() + suggestedSubdomain.slice(1);
        setCompanyName(suggestedCompany);
      }
      
      // Auto-suggest subdomain (but don't force it)
      if (!subdomain) {
        setSubdomain(suggestedSubdomain);
      }
    }
  }, [email]);

  // Poll for tenant status after signup with improved reliability
  const pollTenantStatus = async (domain) => {
    const maxRetries = 20; // Increased for better reliability
    let retries = 0;
    
    const checkStatus = async () => {
      console.log(`Polling tenant status: attempt ${retries + 1} for domain ${domain}`);
      try {
        // Try to fetch the tenant status
        const response = await fetch(`https://${domain}/api/status`, {
          method: 'GET',
          mode: 'no-cors',
          credentials: 'include'
        });
        
        console.log("Tenant appears to be ready");
        return true;
      } catch (error) {
        console.log("Tenant not yet ready, will retry");
        return false;
      }
    };
    
    // Initial check with delay to give server time to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    let isReady = await checkStatus();
    
    while (!isReady && retries < maxRetries) {
      retries++;
      // Exponential backoff for more efficient polling
      const delay = Math.min(2000 + (retries * 1000), 10000);
      console.log(`Waiting ${delay}ms before next check`);
      await new Promise(resolve => setTimeout(resolve, delay));
      isReady = await checkStatus();
    }
    
    return isReady;
  };

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
      // Validate subdomain (basic validation)
      if (!subdomain || subdomain.trim() === "") {
        setErrorMessage("Subdomain is required");
        toast.error("Validation failed", {
          description: "Please provide a subdomain for your workspace"
        });
        return;
      }

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
