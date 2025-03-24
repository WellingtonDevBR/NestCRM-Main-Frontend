
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/services/predictionService";

export function usePredictions() {
  // Get prediction models
  const { 
    data: models = [], 
    isLoading: isModelsLoading,
    error: modelsError
  } = useQuery({
    queryKey: ["predictionModels"],
    queryFn: predictionService.getPredictionModels
  });

  // Get customer predictions
  const {
    data: predictions = [],
    isLoading: isPredictionsLoading,
    error: predictionsError
  } = useQuery({
    queryKey: ["customerPredictions"],
    queryFn: predictionService.getCustomerPredictions
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
    enabled: !!customerId
  });
}
