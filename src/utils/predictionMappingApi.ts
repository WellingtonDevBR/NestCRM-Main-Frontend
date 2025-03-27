
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
    return response;
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
    console.log("Saving prediction mappings:", data);
    const response = await api.post<PredictionMappingData>(PREDICTION_MAPPING_ENDPOINT, data);
    return response;
  } catch (error) {
    console.error("Failed to save prediction mappings:", error);
    throw error;
  }
}
