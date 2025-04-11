
import { useEffect } from "react";
import { toast } from "sonner";

interface UsePaymentStatusCheckProps {
  checkPaymentStatus: () => string | null;
  getStoredSignupData: () => any;
  clearStoredSignupData: () => void;
  completeSignup: (signupData: any, planId: string) => Promise<void>;
  setFormDataFromStored: (data: any) => void;
  setSignupStage: (stage: any) => void;
}

export const usePaymentStatusCheck = ({
  checkPaymentStatus,
  getStoredSignupData,
  clearStoredSignupData,
  completeSignup,
  setFormDataFromStored,
  setSignupStage
}: UsePaymentStatusCheckProps) => {
  
  useEffect(() => {
    // Check payment status when component mounts
    const status = checkPaymentStatus();
    if (status) {
      const storedData = getStoredSignupData();
      if (storedData) {
        if (status === 'success') {
          completeSignup(storedData.signupData, storedData.planId);
        } else {
          toast.error("Payment was not completed", {
            description: "You can try again or choose a different plan"
          });
          setFormDataFromStored(storedData.signupData);
          setSignupStage("plan_selection");
        }
        clearStoredSignupData();
      }
    }
  }, []);
};
