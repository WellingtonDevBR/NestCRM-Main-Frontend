
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
      const response = await api.get<any>(PREDICTION_MAPPING_ENDPOINT);
      console.log("Fetched prediction mappings:", response);
      
      // Format the API response to match our domain model
      // The API returns an array of mappings, but our domain model expects an object with a mappings array
      if (Array.isArray(response)) {
        return { mappings: response };
      }
      
      // Handle the case where the response is already in the expected format
      if (response && typeof response === 'object' && Array.isArray(response.mappings)) {
        return response;
      }
      
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
      
      // Filter out "not_mapped" entries and ensure each mapping has all required fields
      const cleanedMappings = safeData.mappings
        .filter(m => m.tenantField && m.tenantField !== "not_mapped")
        .map(mapping => ({
          modelField: mapping.modelField,
          tenantField: mapping.tenantField,
          category: mapping.category || "" // Ensure category is included
        }));
      
      console.log("Saving prediction mappings:", cleanedMappings);
      const response = await api.post<any>(PREDICTION_MAPPING_ENDPOINT, cleanedMappings);
      
      // Format the response to match our domain model
      if (Array.isArray(response)) {
        return { mappings: response };
      }
      
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
