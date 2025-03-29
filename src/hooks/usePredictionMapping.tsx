
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PredictionMapping, LIGHT_FEATURES, FULL_FEATURES } from '@/domain/models/predictionMapping';
import { PredictionMappingRepository } from '@/domain/repositories/predictionMappingRepository';
import { PredictionMappingRepositoryImpl } from '@/infrastructure/repositories/predictionMappingRepositoryImpl';
import { PredictionMappingService } from '@/application/services/predictionMappingService';
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

  // Determine if we're using lightweight or full model based on field count
  const determineMappingModel = (mappings: PredictionMapping | undefined): 'lightweight' | 'full' => {
    if (!mappings || !mappings.mappings || mappings.mappings.length === 0) {
      return 'lightweight'; // Default to lightweight
    }
    
    // If mappings count is closer to FULL_FEATURES length, assume full model
    if (mappings.mappings.length > LIGHT_FEATURES.length) {
      return 'full';
    }
    
    // Check if we have any advanced feature mappings
    const advancedFeatureFields = FULL_FEATURES
      .filter(feature => !LIGHT_FEATURES.some(lf => lf.modelField === feature.modelField))
      .map(feature => feature.modelField);
    
    // If we have any advanced feature mappings, it's a full model
    if (mappings.mappings.some(mapping => advancedFeatureFields.includes(mapping.modelField))) {
      return 'full';
    }
    
    return 'lightweight';
  };

  // Get the current model type
  const mappingModel = determineMappingModel(mappingData);
  
  // Get mapping for a specific model field
  const getMapping = (modelField: string): string | undefined => {
    return getMappingForField(mappingData, modelField);
  };

  // Get category for a specific model field
  const getMappingCategory = (modelField: string): string | undefined => {
    if (!mappingData || !mappingData.mappings) return undefined;
    
    const mapping = mappingData.mappings.find(m => m.modelField === modelField);
    return mapping?.category;
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
    getMappingCategory,
    saveMappings,
    isSaving,
    updateMapping,
    refetch,
    mappingModel,
    LIGHT_FEATURES,
    FULL_FEATURES
  };
}
