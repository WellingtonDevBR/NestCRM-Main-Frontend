
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/services/predictionService";
import { toast } from "sonner";
import { CustomerPrediction } from "@/domain/models/prediction";

/**
 * Hook to fetch customer predictions
 * Following clean architecture principles with a single responsibility
 */
export function useCustomerPredictions() {
  const {
    data: predictions = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["customerPredictions"],
    queryFn: predictionService.getCustomerPredictions,
    meta: {
      onSuccess: () => {
        console.log("Predictions loaded successfully");
      },
      onError: (error: Error) => {
        toast.error("Failed to load customer predictions");
        console.error("Error loading predictions:", error);
      }
    }
  });

  return {
    predictions,
    isLoading,
    error
  };
}

/**
 * Hook to fetch predictions for a specific customer
 * @param customerId ID of the customer to fetch predictions for
 */
export function useCustomerPredictionById(customerId: string) {
  return useQuery({
    queryKey: ["customerPrediction", customerId],
    queryFn: () => predictionService.getPredictionsByCustomerId(customerId),
    enabled: !!customerId,
    meta: {
      onError: (error: Error) => {
        toast.error(`Failed to load prediction for customer ${customerId}`);
        console.error("Error loading customer prediction:", error);
      }
    }
  });
}
