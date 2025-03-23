
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { AuthResult } from "@/domain/auth/types";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import PersonalInfoFields from "@/components/auth/form/PersonalInfoFields";
import CompanyInfoFields from "@/components/auth/form/CompanyInfoFields";
import PasswordField from "@/components/auth/form/PasswordField";
import TermsCheckbox from "@/components/auth/form/TermsCheckbox";
import SubmitButton from "@/components/auth/form/SubmitButton";
import FormDivider from "@/components/auth/form/FormDivider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const SignUpForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState("");
  const [showSetupProgress, setShowSetupProgress] = useState(false);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  // Progress simulation
  useEffect(() => {
    if (!showSetupProgress) return;

    const stages = [
      "Creating your account...",
      "Setting up your tenant...",
      "Configuring your workspace...",
      "Almost there...",
      "Preparing to redirect..."
    ];

    let currentStage = 0;
    let progress = 0;

    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);
        return;
      }

      progress += 5;
      setSetupProgress(progress);

      // Update stage message at certain progress points
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
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Start showing first stage before API call
      setSetupStage("Creating your account...");
      setShowSetupProgress(true);
      
      // Create signup data object with the correct structure
      const signupData = {
        firstName,
        lastName,
        companyName,
        email,
        subdomain,
        password
      };
      
      console.log('Submitting signup data:', signupData);
      
      const result: AuthResult = await signUp(signupData);
      
      if (result.success && result.session) {
        toast.success("Account created successfully!");
        
        // Continue showing progress animation
        // The animation will continue until the redirect happens
        setTimeout(() => {
          // Redirect to tenant subdomain
          redirectToTenantDomain(result.session.tenant, result.session.token.token);
        }, 5000); // Allow the progress to show for a while before redirecting
      } else {
        setShowSetupProgress(false);
        toast.error("Failed to create account", {
          description: result.error?.message || "Please try again later."
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      setShowSetupProgress(false);
      toast.error("Failed to create account", {
        description: error.message || "Please try again later."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showSetupProgress ? (
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
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <SubmitButton isLoading={isLoading} />
        </form>
      )}

      {!showSetupProgress && (
        <>
          <FormDivider />
          <SocialLoginButtons />
        </>
      )}
    </div>
  );
};

export default SignUpForm;
