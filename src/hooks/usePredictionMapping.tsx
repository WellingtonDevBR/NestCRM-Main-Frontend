import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { fetchPredictionMapping, savePredictionMapping, FieldMapping, PredictionMappingData } from '@/utils/predictionMappingApi';

// Predefined model features with their expected types and descriptions
export const LIGHTWEIGHT_MODEL_FEATURES: Omit<FieldMapping, 'tenantField'>[] = [
  { 
    modelField: "Age", 
    modelType: "number", 
    description: "Customer age in years" 
  },
  { 
    modelField: "Gender", 
    modelType: "select", 
    description: "Customer gender" 
  },
  { 
    modelField: "Partner", 
    modelType: "select", 
    description: "Whether customer has a partner" 
  },
  { 
    modelField: "Tenure", 
    modelType: "number", 
    description: "Number of months the customer has been with the company" 
  },
  { 
    modelField: "Usage_Frequency", 
    modelType: "number", 
    description: "How often the customer uses the service" 
  },
  { 
    modelField: "Days_Since_Last_Interaction", 
    modelType: "number", 
    description: "Number of days since the customer's last interaction with the company" 
  }
];

export const FULL_MODEL_FEATURES: Omit<FieldMapping, 'tenantField'>[] = [
  ...LIGHTWEIGHT_MODEL_FEATURES,
  { 
    modelField: "Dependents", 
    modelType: "select", 
    description: "Whether customer has dependents" 
  },
  { 
    modelField: "Total_Spend", 
    modelType: "number", 
    description: "Total amount spent by the customer" 
  },
  { 
    modelField: "Support_Calls", 
    modelType: "number", 
    description: "Number of support calls made by the customer" 
  },
  { 
    modelField: "Payment_Delay", 
    modelType: "number", 
    description: "Average payment delay in days" 
  },
  { 
    modelField: "Subscription_Type", 
    modelType: "select", 
    description: "Type of subscription" 
  },
  { 
    modelField: "Contract_Length", 
    modelType: "select", 
    description: "Length of customer contract" 
  }
];

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
    queryFn: fetchPredictionMapping,
  });

  // Get mapping for a specific model field
  const getMapping = (modelField: string): string | undefined => {
    if (!mappingData?.mappings) return undefined;
    const mapping = mappingData.mappings.find(m => m.modelField === modelField);
    return mapping?.tenantField === "not_mapped" ? undefined : mapping?.tenantField;
  };

  // Save mappings mutation
  const { mutate: saveMappings, isPending: isSaving } = useMutation({
    mutationFn: (data: PredictionMappingData) => savePredictionMapping(data),
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
  const updateMapping = (modelField: string, tenantField: string) => {
    if (!mappingData) return { mappings: [{ modelField, tenantField }] };
    
    // Make sure mappings exists and is an array
    const currentMappings = Array.isArray(mappingData.mappings) ? mappingData.mappings : [];
    const updatedMappings = [...currentMappings];
    
    const existingIndex = updatedMappings.findIndex(m => m.modelField === modelField);
    
    if (existingIndex >= 0) {
      // Update existing mapping
      updatedMappings[existingIndex] = {
        ...updatedMappings[existingIndex],
        tenantField
      };
    } else {
      // Add new mapping
      updatedMappings.push({ modelField, tenantField });
    }
    
    return { mappings: updatedMappings };
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
    LIGHTWEIGHT_MODEL_FEATURES,
    FULL_MODEL_FEATURES
  };
}
