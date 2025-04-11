
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
      
      // Auto-populate subdomain
      setSubdomain(suggestedSubdomain);
    }
  }, [email, companyName]);

  // Poll for tenant status after signup
  const pollTenantStatus = async (domain) => {
    const maxRetries = 10;
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
    
    // Initial check
    let isReady = await checkStatus();
    
    while (!isReady && retries < maxRetries) {
      retries++;
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
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
      // Validate that subdomain is derived from email domain
      const emailDomain = email.split('@')[1]?.split('.')[0].toLowerCase();
      if (subdomain !== emailDomain) {
        setErrorMessage("Subdomain must match your email domain");
        toast.error("Validation failed", {
          description: "Subdomain must match your email domain"
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
      
      const result = await handlePlanSelection(signupData, planId);
      
      if (result.success) {
        if (result.redirectUrl) {
          // Redirect to Stripe checkout
          window.location.href = result.redirectUrl;
          return;
        }
        // If successful without redirect, plan was a free trial
        // The createTrialAccount already handles the API signup
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
          setSetupStage("Waiting for your workspace to be ready...");
          
          // Show a loading toast before starting to poll
          toast.loading("Setting up your workspace...");
          
          // Poll for tenant status (max 10 retries, 3 second intervals)
          const isReady = await pollTenantStatus(tenantDomain);
          
          if (isReady) {
            console.log('Tenant domain is ready, proceeding with redirect');
            // Use direct navigation for consistent redirection
            const protocol = window.location.protocol;
            const url = `${protocol}//${tenantDomain}/dashboard`;
            console.log('Redirecting to tenant URL:', url);
            
            // Use setTimeout to ensure cookies are properly set before redirecting
            setTimeout(() => {
              console.log('Executing delayed redirect to:', url);
              // Use window.location.replace for a cleaner redirect
              window.location.replace(url);
            }, 1000);
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
