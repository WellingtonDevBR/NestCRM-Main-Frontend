
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
      
      // If the response is already in the correct format with mappings array
      if (response && typeof response === 'object' && Array.isArray(response.mappings)) {
        return response as PredictionMapping;
      }
      
      // If the response is an array of mappings (without the mappings wrapper)
      if (Array.isArray(response)) {
        return { 
          mappings: response.map(mapping => ({
            modelField: mapping.modelField,
            tenantField: mapping.tenantField,
            category: mapping.category || ""
          }))
        };
      }
      
      // If the response has a different structure, try to extract mappings
      if (response && typeof response === 'object') {
        // Check if there's a mappings property
        if (Array.isArray(response.mappings)) {
          return {
            mappings: response.mappings.map((mapping: any) => ({
              modelField: mapping.modelField,
              tenantField: mapping.tenantField,
              category: mapping.category || ""
            }))
          };
        }
        
        // Handle case where response itself might be a mapping array
        const responseKeys = Object.keys(response);
        if (responseKeys.includes('modelField') || responseKeys.includes('tenantField')) {
          return {
            mappings: [response].map((mapping: any) => ({
              modelField: mapping.modelField,
              tenantField: mapping.tenantField,
              category: mapping.category || ""
            }))
          };
        }
      }
      
      // If no valid mappings found, return empty mappings
      console.warn("No valid mappings found in response:", response);
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
