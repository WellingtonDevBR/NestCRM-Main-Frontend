
import React from "react";
import StepIndicator from "@/components/auth/form/StepIndicator";
import SignupStageManager from "@/components/auth/form/SignupStageManager";
import { useSignupForm } from "@/hooks/useSignupForm";

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
    <div className="space-y-6">
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
  );
};

export default SignUpForm;
