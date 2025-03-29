
import { PredictionMapping, FieldMapping } from "@/domain/models/predictionMapping";

/**
 * Get the mapping for a specific model field
 */
export const getMappingForField = (
  mappings: PredictionMapping | undefined, 
  modelField: string
): string | undefined => {
  if (!mappings?.mappings) return undefined;
  
  const mapping = mappings.mappings.find(m => m.modelField === modelField);
  return mapping?.tenantField === "not_mapped" ? undefined : mapping?.tenantField;
};

/**
 * Get the category for a specific model field mapping
 */
export const getCategoryForField = (
  mappings: PredictionMapping | undefined, 
  modelField: string
): string | undefined => {
  if (!mappings?.mappings) return undefined;
  
  const mapping = mappings.mappings.find(m => m.modelField === modelField);
  return mapping?.category;
};

/**
 * Update a specific mapping in the prediction mappings
 */
export const updateMappingForField = (
  currentMappings: PredictionMapping | undefined, 
  modelField: string, 
  tenantField: string,
  category?: string
): PredictionMapping => {
  console.log(`updateMappingForField - modelField: ${modelField}, tenantField: ${tenantField}, category: ${category}`);
  
  // Ensure we have a valid mappings array
  const validCurrentMappings = (currentMappings && currentMappings.mappings && Array.isArray(currentMappings.mappings))
    ? currentMappings
    : { mappings: [] };
  
  // Create a deep copy of the mappings
  const updatedMappings: PredictionMapping = { 
    mappings: [...validCurrentMappings.mappings]
  };
  
  // Find if mapping already exists for this model field
  const existingIndex = updatedMappings.mappings.findIndex(m => m.modelField === modelField);
  
  if (existingIndex !== -1) {
    // Update existing mapping
    updatedMappings.mappings[existingIndex] = {
      ...updatedMappings.mappings[existingIndex],
      tenantField,
      category // Include category in the updated mapping
    };
  } else {
    // Add new mapping
    updatedMappings.mappings.push({
      modelField,
      tenantField,
      category // Include category in the new mapping
    });
  }
  
  return updatedMappings;
};

/**
 * Calculate mapping statistics
 */
export const calculateMappingStats = (
  mappings: PredictionMapping | undefined, 
  relevantFeatures: { modelField: string }[]
): { mapped: number; total: number; } => {
  if (!mappings?.mappings) return { mapped: 0, total: relevantFeatures.length };
  
  const mapped = relevantFeatures.filter(feature => {
    const mapping = getMappingForField(mappings, feature.modelField);
    return mapping && mapping !== "not_mapped";
  }).length;
  
  return { 
    mapped, 
    total: relevantFeatures.length
  };
};
