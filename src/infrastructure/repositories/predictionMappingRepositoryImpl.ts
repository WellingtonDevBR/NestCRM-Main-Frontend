
import { api } from "@/utils/api";
import { PredictionMapping } from "@/domain/models/predictionMapping";
import { PredictionMappingRepository } from "@/domain/repositories/predictionMappingRepository";

// API endpoints
const PREDICTION_MAPPING_ENDPOINT = "/settings/prediction-mapping";

/**
 * Implementation of the PredictionMappingRepository
 * This handles the infrastructure concerns like API calls
 */
export class PredictionMappingRepositoryImpl implements PredictionMappingRepository {
  /**
   * Fetch the current prediction field mappings
   */
  async fetchMappings(): Promise<PredictionMapping> {
    try {
      const response = await api.get<PredictionMapping>(PREDICTION_MAPPING_ENDPOINT);
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
  async saveMappings(data: PredictionMapping): Promise<PredictionMapping> {
    try {
      // Ensure data has the expected structure
      const safeData = {
        mappings: Array.isArray(data.mappings) ? data.mappings : []
      };
      
      console.log("Saving prediction mappings:", safeData);
      const response = await api.post<PredictionMapping>(PREDICTION_MAPPING_ENDPOINT, safeData);
      
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
}
