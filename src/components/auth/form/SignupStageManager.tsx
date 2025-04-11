
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import PersonalInfoFields from "@/components/auth/form/PersonalInfoFields";
import CompanyInfoFields from "@/components/auth/form/CompanyInfoFields";
import PasswordField from "@/components/auth/form/PasswordField";
import TermsCheckbox from "@/components/auth/form/TermsCheckbox";
import SubmitButton from "@/components/auth/form/SubmitButton";
import PlanSelection from "@/components/auth/form/PlanSelection";
import SetupProgress from "@/components/auth/form/SetupProgress";
import SignupProcessing from "@/components/auth/form/SignupProcessing";
import { SignupStep } from "@/components/auth/form/StepIndicator";
import { SignUpData } from "@/domain/auth/types";
import { Separator } from "@/components/ui/separator";

interface SignupStageManagerProps {
  signupStage: SignupStep;
  errorMessage: string | null;
  isLoading: boolean;
  showSetupProgress: boolean;
  setupStage: string;
  setupProgress: number;
  userData: {
    firstName: string;
    setFirstName: (value: string) => void;
    lastName: string;
    setLastName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    companyName: string;
    setCompanyName: (value: string) => void;
    subdomain: string;
    setSubdomain: (value: string) => void;
  };
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onPlanSelected: (planId: string) => void;
}

const SignupStageManager: React.FC<SignupStageManagerProps> = ({
  signupStage,
  errorMessage,
  isLoading,
  showSetupProgress,
  setupStage,
  setupProgress,
  userData,
  onFormSubmit,
  onPlanSelected
}) => {
  // Destructure userData for easier access
  const {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    companyName, setCompanyName,
    subdomain, setSubdomain
  } = userData;

  if (showSetupProgress) {
    return <SetupProgress setupStage={setupStage} setupProgress={setupProgress} />;
  }

  switch (signupStage) {
    case "form":
      return (
        <form onSubmit={onFormSubmit} className="space-y-6">
          {errorMessage && (
            <Alert variant="destructive" className="mb-4 animate-in fade-in slide-in-from-top-5 duration-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6">Personal Information</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your details to create your account
              </p>
            </div>
            <PersonalInfoFields
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
            />
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6">Company Information</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Set up your organization workspace
              </p>
            </div>
            <CompanyInfoFields
              companyName={companyName}
              setCompanyName={setCompanyName}
              subdomain={subdomain}
              setSubdomain={setSubdomain}
            />
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6">Security</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a secure password for your account
              </p>
            </div>
            <PasswordField
              password={password}
              setPassword={setPassword}
            />
          </div>

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
          onContinue={onPlanSelected}
          isLoading={isLoading}
        />
      );
      
    case "processing":
      return <SignupProcessing />;
  }
};

export default SignupStageManager;
