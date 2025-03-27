
import { api } from "@/utils/api";

// API endpoints
const PREDICTION_MAPPING_ENDPOINT = "/settings/prediction-mapping";

// Types for prediction mapping
export interface FieldMapping {
  modelField: string; // The standardized field name expected by the model
  tenantField: string; // The tenant's custom field key
  modelType?: string; // The expected data type (number, text, select, etc.)
  description?: string; // Optional description of what this field is used for
}

export interface PredictionMappingData {
  mappings: FieldMapping[];
}

/**
 * Fetch the current prediction field mappings
 */
export async function fetchPredictionMapping(): Promise<PredictionMappingData> {
  try {
    const response = await api.get<PredictionMappingData>(PREDICTION_MAPPING_ENDPOINT);
    console.log("Fetched prediction mappings:", response);
    
    // Ensure response has the expected structure
    if (response && typeof response === 'object') {
      return {
        mappings: Array.isArray(response.mappings) ? response.mappings : []
      };
    }
    
    // Return empty mappings for any unexpected response format
    return { mappings: [] };
  } catch (error) {
    console.error("Failed to fetch prediction mappings:", error);
    // Return empty mappings on error
    return { mappings: [] };
  }
}

/**
 * Save prediction field mappings
 */
export async function savePredictionMapping(data: PredictionMappingData): Promise<PredictionMappingData> {
  try {
    // Ensure data has the expected structure
    const safeData = {
      mappings: Array.isArray(data.mappings) ? data.mappings : []
    };
    
    console.log("Saving prediction mappings:", safeData);
    const response = await api.post<PredictionMappingData>(PREDICTION_MAPPING_ENDPOINT, safeData);
    
    // Ensure response has the expected structure
    if (response && typeof response === 'object') {
      return {
        mappings: Array.isArray(response.mappings) ? response.mappings : []
      };
    }
    
    return safeData;
  } catch (error) {
    console.error("Failed to save prediction mappings:", error);
    throw error;
  }
}
