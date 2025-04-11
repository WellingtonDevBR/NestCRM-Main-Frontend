
import { useState } from "react";
import { SignupStep } from "@/components/auth/form/StepIndicator";

export const useSignupFormState = () => {
  // Form state management
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signupStage, setSignupStage] = useState<SignupStep>("form");

  // Personal information fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [subdomain, setSubdomain] = useState("");

  // Helper function to get all form data as an object
  const getFormData = () => ({
    firstName,
    lastName,
    email,
    password,
    companyName,
    subdomain,
  });

  // Helper function to set form state from stored data
  const setFormDataFromStored = (data: any) => {
    if (data) {
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setEmail(data.email || "");
      setPassword(data.password || "");
      setCompanyName(data.companyName || "");
      setSubdomain(data.subdomain || "");
    }
  };

  return {
    // State
    isLoading, 
    setIsLoading,
    errorMessage, 
    setErrorMessage,
    signupStage, 
    setSignupStage,
    
    // Form fields
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
    
    // Helper functions
    getFormData,
    setFormDataFromStored
  };
};
