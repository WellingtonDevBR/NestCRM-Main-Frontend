
import { PredictionMapping } from '../models/predictionMapping';

/**
 * Repository interface for prediction mappings
 * Following the repository pattern from DDD
 */
export interface PredictionMappingRepository {
  /**
   * Fetch prediction mappings
   */
  fetchMappings(): Promise<PredictionMapping>;
  
  /**
   * Save prediction mappings
   */
  saveMappings(mapping: PredictionMapping): Promise<PredictionMapping>;
}
