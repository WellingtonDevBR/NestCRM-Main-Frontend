
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
    description: "Customer gender (typically M/F or other categories)" 
  },
  { 
    modelField: "Partner", 
    modelType: "select", 
    description: "Whether customer has a partner" 
  },
  { 
    modelField: "Dependents", 
    modelType: "select", 
    description: "Whether customer has dependents" 
  },
  { 
    modelField: "Tenure", 
    modelType: "number", 
    description: "Number of months the customer has been with the company" 
  }
];

export const FULL_MODEL_FEATURES: Omit<FieldMapping, 'tenantField'>[] = [
  ...LIGHTWEIGHT_MODEL_FEATURES,
  { 
    modelField: "PhoneService", 
    modelType: "select", 
    description: "Whether customer has phone service" 
  },
  { 
    modelField: "MultipleLines", 
    modelType: "select", 
    description: "Whether customer has multiple lines" 
  },
  { 
    modelField: "InternetService", 
    modelType: "select", 
    description: "Type of internet service" 
  },
  { 
    modelField: "OnlineSecurity", 
    modelType: "select", 
    description: "Whether customer has online security" 
  },
  { 
    modelField: "OnlineBackup", 
    modelType: "select", 
    description: "Whether customer has online backup" 
  },
  { 
    modelField: "DeviceProtection", 
    modelType: "select", 
    description: "Whether customer has device protection" 
  },
  { 
    modelField: "TechSupport", 
    modelType: "select", 
    description: "Whether customer has tech support" 
  },
  { 
    modelField: "StreamingTV", 
    modelType: "select", 
    description: "Whether customer has streaming TV" 
  },
  { 
    modelField: "StreamingMovies", 
    modelType: "select", 
    description: "Whether customer has streaming movies" 
  },
  { 
    modelField: "Contract", 
    modelType: "select", 
    description: "Contract type" 
  },
  { 
    modelField: "PaperlessBilling", 
    modelType: "select", 
    description: "Whether customer has paperless billing" 
  },
  { 
    modelField: "PaymentMethod", 
    modelType: "select", 
    description: "Payment method" 
  },
  { 
    modelField: "MonthlyCharges", 
    modelType: "number", 
    description: "Monthly charges in currency units" 
  },
  { 
    modelField: "TotalCharges", 
    modelType: "number", 
    description: "Total charges in currency units" 
  },
  { 
    modelField: "Churn", 
    modelType: "select", 
    description: "Whether customer churned (target variable)" 
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
    return mapping?.tenantField;
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
