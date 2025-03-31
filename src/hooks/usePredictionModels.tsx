
import { useQuery } from "@tanstack/react-query";
import { predictionService } from "@/services/predictionService";
import { toast } from "sonner";
import { PredictionModel } from "@/domain/models/prediction";

/**
 * Hook to fetch prediction models
 * Following clean architecture principles with a single responsibility
 */
export function usePredictionModels() {
  const { 
    data: models = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ["predictionModels"],
    queryFn: predictionService.getPredictionModels,
    meta: {
      onSuccess: () => {
        console.log("Models loaded successfully");
      },
      onError: (error: Error) => {
        toast.error("Failed to load prediction models");
        console.error("Error loading models:", error);
      }
    }
  });

  return {
    models,
    isLoading,
    error
  };
}
