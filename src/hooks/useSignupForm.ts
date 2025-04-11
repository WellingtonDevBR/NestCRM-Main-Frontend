
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { SignUpData, AuthResult } from "@/domain/auth/types";
import { StripeService } from "@/services/stripeService";
import { SignupStep } from "@/components/auth/form/StepIndicator";
import { useSignupProgress } from "./useSignupProgress";

export const useSignupForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupStage, setSignupStage] = useState<SignupStep>("form");
  
  const {
    setupProgress,
    setupStage,
    showSetupProgress,
    setShowSetupProgress,
    startProgressSimulation,
    setSetupStage
  } = useSignupProgress();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
    // Check payment status when component mounts
    const checkPaymentStatus = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('payment_status')) {
        const status = urlParams.get('payment_status');
        
        const storedData = StripeService.getStoredSignupData();
        if (storedData) {
          if (status === 'success') {
            completeSignup(storedData.signupData, storedData.planId);
          } else {
            toast.error("Payment was not completed", {
              description: "You can try again or choose a different plan"
            });
            setFirstName(storedData.signupData.firstName);
            setLastName(storedData.signupData.lastName);
            setEmail(storedData.signupData.email);
            setPassword(storedData.signupData.password);
            setCompanyName(storedData.signupData.companyName);
            setSubdomain(storedData.signupData.subdomain);
            setSignupStage("plan_selection");
          }
          StripeService.clearStoredSignupData();
        }
      }
    };
    
    checkPaymentStatus();
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
      const selectedPlan = StripeService.getPlanById(planId);
      if (!selectedPlan) throw new Error("Invalid plan selected");
      
      const signupData = {
        firstName,
        lastName,
        companyName,
        email,
        subdomain,
        password
      };
      
      console.log('Selected plan:', selectedPlan);
      
      if (selectedPlan.priceValue === 0) {
        await completeSignup(signupData, planId);
        return;
      }
      
      const checkoutUrl = await StripeService.createCheckoutSession(signupData, selectedPlan);
      
      if (checkoutUrl) {
        StripeService.storeSignupData(signupData, planId);
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Could not create checkout session");
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
  
  const completeSignup = async (signupData: SignUpData, planId: string) => {
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
      const errorMsg = "Our services are currently unavailable. Please try again later.";
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
