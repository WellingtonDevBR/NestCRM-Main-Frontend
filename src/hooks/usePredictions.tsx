
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/services/predictionService";
import { toast } from "sonner";

export function usePredictions() {
  // Get prediction models
  const { 
    data: models = [], 
    isLoading: isModelsLoading,
    error: modelsError
  } = useQuery({
    queryKey: ["predictionModels"],
    queryFn: predictionService.getPredictionModels,
    onError: (error) => {
      toast.error("Failed to load prediction models");
      console.error("Error loading models:", error);
    }
  });

  // Get customer predictions
  const {
    data: predictions = [],
    isLoading: isPredictionsLoading,
    error: predictionsError
  } = useQuery({
    queryKey: ["customerPredictions"],
    queryFn: predictionService.getCustomerPredictions,
    onError: (error) => {
      toast.error("Failed to load customer predictions");
      console.error("Error loading predictions:", error);
    }
  });

  const isLoading = isModelsLoading || isPredictionsLoading;
  const error = modelsError || predictionsError;

  return {
    models,
    predictions,
    isLoading,
    error
  };
}

export function useCustomerPrediction(customerId: string) {
  return useQuery({
    queryKey: ["customerPrediction", customerId],
    queryFn: () => predictionService.getPredictionsByCustomerId(customerId),
    enabled: !!customerId,
    onError: (error) => {
      toast.error(`Failed to load prediction for customer ${customerId}`);
      console.error("Error loading customer prediction:", error);
    }
  });
}
