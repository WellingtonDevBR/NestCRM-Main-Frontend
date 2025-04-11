
import React from "react";
import StepIndicator from "@/components/auth/form/StepIndicator";
import SignupStageManager from "@/components/auth/form/SignupStageManager";
import { useSignupForm } from "@/hooks/useSignupForm";
import { Card } from "@/components/ui/card";

const SignUpForm = () => {
  const {
    // States
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
    handlePlanSelected
  } = useSignupForm();

  const userData = {
    firstName, setFirstName,
    lastName, setLastName,
    email, setEmail,
    password, setPassword,
    companyName, setCompanyName,
    subdomain, setSubdomain
  };

  return (
    <Card className="shadow-lg border-slate-200/60 p-6 rounded-xl">
      <div className="w-full">
        <StepIndicator currentStep={signupStage} />
        <SignupStageManager
          signupStage={signupStage}
          errorMessage={errorMessage}
          isLoading={isLoading}
          showSetupProgress={showSetupProgress}
          setupStage={setupStage}
          setupProgress={setupProgress}
          userData={userData}
          onFormSubmit={handleFormSubmit}
          onPlanSelected={handlePlanSelected}
        />
      </div>
    </Card>
  );
};

export default SignUpForm;
