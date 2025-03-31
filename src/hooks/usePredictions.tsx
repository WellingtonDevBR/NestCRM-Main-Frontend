
import { usePredictionModels } from "@/hooks/usePredictionModels";
import { useCustomerPredictions } from "@/hooks/useCustomerPredictions";

/**
 * Facade hook that combines model and customer prediction data
 * This follows clean architecture by separating the data fetching concerns
 * into individual hooks while providing a simple interface for components
 */
export function usePredictions() {
  // Get prediction models using the dedicated hook
  const { 
    models,
    isLoading: isModelsLoading,
    error: modelsError
  } = usePredictionModels();

  // Get customer predictions using the dedicated hook
  const {
    predictions,
    isLoading: isPredictionsLoading,
    error: predictionsError
  } = useCustomerPredictions();

  // Combine loading states and errors
  const isLoading = isModelsLoading || isPredictionsLoading;
  const error = modelsError || predictionsError;

  return {
    models,
    predictions,
    isLoading,
    error
  };
}

// Re-export the single customer prediction hook for convenience
export { useCustomerPredictionById } from "@/hooks/useCustomerPredictions";
