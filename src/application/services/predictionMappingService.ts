
import { PredictionMapping, FieldMapping, ModelFeature } from "@/domain/models/predictionMapping";
import { PredictionMappingRepository } from "@/domain/repositories/predictionMappingRepository";
import { getMappingForField, updateMappingForField, calculateMappingStats } from "@/domain/utils/predictionMappingUtils";

/**
 * Application service for prediction mapping
 * This handles the use cases related to prediction mapping
 */
export class PredictionMappingService {
  constructor(private repository: PredictionMappingRepository) {}

  /**
   * Fetch prediction mappings
   */
  async fetchMappings(): Promise<PredictionMapping> {
    return this.repository.fetchMappings();
  }

  /**
   * Save prediction mappings
   */
  async saveMappings(mapping: PredictionMapping): Promise<PredictionMapping> {
    // Clean mappings by filtering out "not_mapped" entries
    const cleanedMappings = {
      mappings: mapping.mappings.filter(m => 
        m.tenantField && m.tenantField !== "not_mapped"
      )
    };
    
    return this.repository.saveMappings(cleanedMappings);
  }

  /**
   * Get mapping for a specific model field
   */
  getMappingForField(mappings: PredictionMapping, modelField: string): string | undefined {
    return getMappingForField(mappings, modelField);
  }

  /**
   * Update a specific mapping
   */
  updateMapping(mappings: PredictionMapping, modelField: string, tenantField: string): PredictionMapping {
    return updateMappingForField(mappings, modelField, tenantField);
  }

  /**
   * Calculate mapping statistics
   */
  calculateMappingStats(mappings: PredictionMapping, features: ModelFeature[]): { 
    mapped: number; 
    total: number;
    percentage: number;
  } {
    const { mapped, total } = calculateMappingStats(mappings, features);
    const percentage = total > 0 ? Math.round((mapped / total) * 100) : 0;
    
    return { mapped, total, percentage };
  }
}
