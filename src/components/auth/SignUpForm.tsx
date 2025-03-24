
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
import { AlertCircle } from "lucide-react";

const SignUpForm = () => {
  const { signUp, redirectToTenantDomain } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [setupProgress, setSetupProgress] = useState(0);
  const [setupStage, setSetupStage] = useState("");
  const [showSetupProgress, setShowSetupProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
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

      progress += 2; // Slower progress increment
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
    setErrorMessage(null);
    
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
        
        // Instead of using setTimeout for arbitrary delay,
        // we'll continue showing the progress animation
        // while the redirectToTenantDomain method performs status checks
        
        // Redirect will handle status checks and retries
        redirectToTenantDomain(result.session.tenant);
        
        // Let the progress bar continue running during the redirect process
        // No need to manually set isLoading to false as page will redirect
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
