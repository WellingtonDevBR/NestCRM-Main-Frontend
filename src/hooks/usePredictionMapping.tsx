
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PredictionMapping, LIGHT_FEATURES, FULL_FEATURES } from '@/domain/models/predictionMapping';
import { PredictionMappingRepository } from '@/domain/repositories/predictionMappingRepository';
import { PredictionMappingRepositoryImpl } from '@/infrastructure/repositories/predictionMappingRepositoryImpl';
import { PredictionMappingService } from '@/application/services/predictionMappingService';
import { usePredictionMappingState } from './usePredictionMappingState';
import { getMappingForField, updateMappingForField } from '@/domain/utils/predictionMappingUtils';

// Create repository and service instances
const mappingRepository: PredictionMappingRepository = new PredictionMappingRepositoryImpl();
const mappingService = new PredictionMappingService(mappingRepository);

export function usePredictionMapping() {
  const queryClient = useQueryClient();
  
  // Fetch current mappings
  const { 
    data: mappingData, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ["predictionMapping"],
    queryFn: () => mappingService.fetchMappings(),
  });

  // Get mapping for a specific model field
  const getMapping = (modelField: string): string | undefined => {
    if (!mappingData || !mappingData.mappings) return undefined;
    
    const mapping = mappingData.mappings.find(m => m.modelField === modelField);
    console.log(`getMapping for ${modelField}:`, mapping?.tenantField);
    
    return mapping?.tenantField;
  };

  // Save mappings mutation
  const { mutate: saveMappings, isPending: isSaving } = useMutation({
    mutationFn: (data: PredictionMapping) => mappingService.saveMappings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictionMapping"] });
      toast.success("Prediction field mappings saved successfully");
    },
    onError: (error) => {
      console.error("Failed to save mappings:", error);
      toast.error("Failed to save prediction field mappings");
    }
  });

  // Update a specific mapping
  const updateMapping = (modelField: string, tenantField: string, category: string, currentMappings: PredictionMapping = mappingData || { mappings: [] }): PredictionMapping => {
    // Get the updated mappings from the utility function
    return updateMappingForField(currentMappings, modelField, tenantField, category);
  };

  return {
    mappingData: mappingData || { mappings: [] },
    isLoading,
    error,
    getMapping,
    saveMappings,
    isSaving,
    updateMapping,
    refetch,
    LIGHT_FEATURES,
    FULL_FEATURES
  };
}
