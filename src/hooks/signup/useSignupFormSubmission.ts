
import { useState } from "react";
import { toast } from "sonner";
import { SignupStep } from "@/components/auth/form/StepIndicator";

interface UseSignupFormSubmissionProps {
  subdomain: string;
  setErrorMessage: (error: string | null) => void;
  setSignupStage: (stage: SignupStep) => void;
}

interface UseSignupFormSubmissionReturn {
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const useSignupFormSubmission = ({
  subdomain,
  setErrorMessage,
  setSignupStage
}: UseSignupFormSubmissionProps): UseSignupFormSubmissionReturn => {
  
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      // Validate subdomain (basic validation)
      if (!subdomain || subdomain.trim() === "") {
        setErrorMessage("Subdomain is required");
        toast.error("Validation failed", {
          description: "Please provide a subdomain for your workspace"
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

  return {
    handleFormSubmit
  };
};
