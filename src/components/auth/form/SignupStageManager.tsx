
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
          onContinue={onPlanSelected}
          isLoading={isLoading}
        />
      );
      
    case "processing":
      return <SignupProcessing />;
  }
};

export default SignupStageManager;
