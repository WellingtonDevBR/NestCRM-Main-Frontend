import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthResult } from "@/domain/auth/types";
import PersonalInfoFields from "@/components/auth/form/PersonalInfoFields";
import CompanyInfoFields from "@/components/auth/form/CompanyInfoFields";
import PasswordField from "@/components/auth/form/PasswordField";
import TermsCheckbox from "@/components/auth/form/TermsCheckbox";
import SubmitButton from "@/components/auth/form/SubmitButton";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PlanSelection, { plans } from "@/components/auth/form/PlanSelection";
import { StripeService } from "@/services/stripeService";

// Signup stages
type SignupStage = "form" | "plan_selection" | "processing";

const SignUpForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState("");
  const [showSetupProgress, setShowSetupProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupStage, setSignupStage] = useState<SignupStage>("form");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  useEffect(() => {
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

  useEffect(() => {
    if (!showSetupProgress) return;

    const stages = [
      "Creating your account...",
      "Setting up your tenant...",
      "Configuring your workspace...",
      "Checking tenant status...",
      "Preparing to redirect..."
    ];

    let currentStage = 0;
    let progress = 0;

    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        return;
      }

      progress += 2;
      setSetupProgress(progress);

      if (progress === 20 && currentStage < 1) {
        currentStage = 1;
        setSetupStage(stages[currentStage]);
      } else if (progress === 40 && currentStage < 2) {
        currentStage = 2;
        setSetupStage(stages[currentStage]);
      } else if (progress === 60 && currentStage < 3) {
        currentStage = 3;
        setSetupStage(stages[currentStage]);
      } else if (progress === 80 && currentStage < 4) {
        currentStage = 4;
        setSetupStage(stages[currentStage]);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [showSetupProgress]);
  
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
      const selectedPlan = plans.find(p => p.id === planId);
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
  
  const completeSignup = async (signupData: any, planId: string) => {
    setSignupStage("processing");
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      setSetupStage("Creating your account...");
      setShowSetupProgress(true);
      
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

  const renderContentByStage = () => {
    if (showSetupProgress) {
      return (
        <div className="space-y-4">
          <Alert>
            <AlertTitle className="text-lg font-medium">Setting up your account</AlertTitle>
            <AlertDescription>
              {setupStage}
            </AlertDescription>
          </Alert>
          <Progress value={setupProgress} className="h-2" />
          <p className="text-sm text-center text-muted-foreground mt-2">
            Please wait while we set up your workspace. This may take a moment...
          </p>
        </div>
      );
    }

    switch (signupStage) {
      case "form":
        return (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <PersonalInfoFields
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
            />

            <CompanyInfoFields
              companyName={companyName}
              setCompanyName={setCompanyName}
              subdomain={subdomain}
              setSubdomain={setSubdomain}
            />

            <PasswordField
              password={password}
              setPassword={setPassword}
            />

            <TermsCheckbox />

            <SubmitButton isLoading={isLoading}>
              Continue
            </SubmitButton>
          </form>
        );
        
      case "plan_selection":
        return (
          <PlanSelection 
            signupData={{ firstName, lastName, companyName, email, subdomain, password }}
            onContinue={handlePlanSelected}
            isLoading={isLoading}
          />
        );
        
      case "processing":
        return (
          <div className="text-center">
            <p className="text-lg font-medium">Processing your request...</p>
            <p className="text-muted-foreground">Please wait while we set up your account.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderContentByStage()}
    </div>
  );
};

export default SignUpForm;
