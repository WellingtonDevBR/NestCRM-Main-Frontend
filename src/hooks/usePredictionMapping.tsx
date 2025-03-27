
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PredictionMapping, LIGHT_FEATURES, FULL_FEATURES, FieldMapping } from '@/domain/models/predictionMapping';
import { PredictionMappingRepository } from '@/domain/repositories/predictionMappingRepository';
import { PredictionMappingRepositoryImpl } from '@/infrastructure/repositories/predictionMappingRepositoryImpl';
import { PredictionMappingService } from '@/application/services/predictionMappingService';

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
    return mappingService.getMappingForField(mappingData || { mappings: [] }, modelField);
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
  const updateMapping = (modelField: string, tenantField: string, currentMappings: PredictionMapping = mappingData || { mappings: [] }): PredictionMapping => {
    console.log(`updateMapping - modelField: ${modelField}, tenantField: ${tenantField}`);
    console.log('Current mappings before update:', JSON.stringify(currentMappings));
    
    // Create a deep copy of the mappings
    const mappingsCopy: PredictionMapping = { 
      mappings: Array.isArray(currentMappings.mappings) 
        ? [...currentMappings.mappings]
        : []
    };
    
    const existingIndex = mappingsCopy.mappings.findIndex(m => m.modelField === modelField);
    
    if (existingIndex !== -1) {
      // Update existing mapping
      mappingsCopy.mappings[existingIndex] = {
        ...mappingsCopy.mappings[existingIndex],
        tenantField
      };
    } else {
      // Add new mapping
      mappingsCopy.mappings.push({
        modelField,
        tenantField
      });
    }
    
    console.log('Mappings after update:', JSON.stringify(mappingsCopy));
    return mappingsCopy;
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
