
import { PredictionMapping, FieldMapping, ModelFeature } from "@/domain/models/predictionMapping";
import { PredictionMappingRepository } from "@/domain/repositories/predictionMappingRepository";

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
    if (!mappings?.mappings) return undefined;
    const mapping = mappings.mappings.find(m => m.modelField === modelField);
    return mapping?.tenantField === "not_mapped" ? undefined : mapping?.tenantField;
  }

  /**
   * Update a specific mapping
   */
  updateMapping(mappings: PredictionMapping, modelField: string, tenantField: string): PredictionMapping {
    if (!mappings) return { mappings: [{ modelField, tenantField }] };
    
    // Make sure mappings exists and is an array
    const currentMappings = Array.isArray(mappings.mappings) ? mappings.mappings : [];
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
  }

  /**
   * Calculate mapping statistics
   */
  calculateMappingStats(mappings: PredictionMapping, features: ModelFeature[]): { 
    mapped: number; 
    total: number;
    percentage: number;
  } {
    if (!mappings?.mappings) return { mapped: 0, total: features.length, percentage: 0 };
    
    const mapped = features.filter(feature => {
      const mapping = this.getMappingForField(mappings, feature.modelField);
      return mapping && mapping !== "not_mapped";
    }).length;
    
    const total = features.length;
    const percentage = total > 0 ? Math.round((mapped / total) * 100) : 0;
    
    return { mapped, total, percentage };
  }
}
