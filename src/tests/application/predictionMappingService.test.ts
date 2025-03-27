
import { PredictionMappingService } from '@/application/services/predictionMappingService';
import { PredictionMappingRepository } from '@/domain/repositories/predictionMappingRepository';
import { PredictionMapping, ModelFeature } from '@/domain/models/predictionMapping';

// Mock repository implementation
class MockPredictionMappingRepository implements PredictionMappingRepository {
  mockData: PredictionMapping = { mappings: [] };

  async fetchMappings(): Promise<PredictionMapping> {
    return this.mockData;
  }

  async saveMappings(data: PredictionMapping): Promise<PredictionMapping> {
    this.mockData = { ...data };
    return this.mockData;
  }

  // Helper to set mock data for testing
  setMockData(data: PredictionMapping) {
    this.mockData = data;
  }
}

describe('PredictionMappingService', () => {
  let repository: MockPredictionMappingRepository;
  let service: PredictionMappingService;
  
  beforeEach(() => {
    repository = new MockPredictionMappingRepository();
    service = new PredictionMappingService(repository);
  });

  test('getMappingForField returns correct mapping', () => {
    const mappings: PredictionMapping = {
      mappings: [
        { modelField: 'Age', tenantField: 'customer_age' },
        { modelField: 'Gender', tenantField: 'not_mapped' },
      ]
    };

    expect(service.getMappingForField(mappings, 'Age')).toBe('customer_age');
    expect(service.getMappingForField(mappings, 'Gender')).toBeUndefined();
    expect(service.getMappingForField(mappings, 'NonExistent')).toBeUndefined();
  });

  test('updateMapping correctly updates an existing mapping', () => {
    const initialMappings: PredictionMapping = {
      mappings: [
        { modelField: 'Age', tenantField: 'old_age_field' },
      ]
    };

    const updated = service.updateMapping(initialMappings, 'Age', 'new_age_field');
    
    expect(updated.mappings).toHaveLength(1);
    expect(updated.mappings[0].tenantField).toBe('new_age_field');
  });

  test('updateMapping adds a new mapping if it doesn\'t exist', () => {
    const initialMappings: PredictionMapping = {
      mappings: [
        { modelField: 'Age', tenantField: 'customer_age' },
      ]
    };

    const updated = service.updateMapping(initialMappings, 'Gender', 'customer_gender');
    
    expect(updated.mappings).toHaveLength(2);
    expect(updated.mappings[1].modelField).toBe('Gender');
    expect(updated.mappings[1].tenantField).toBe('customer_gender');
  });

  test('calculateMappingStats returns correct statistics', () => {
    const mappings: PredictionMapping = {
      mappings: [
        { modelField: 'Age', tenantField: 'customer_age' },
        { modelField: 'Gender', tenantField: 'customer_gender' },
        { modelField: 'Tenure', tenantField: 'not_mapped' },
      ]
    };

    const features: ModelFeature[] = [
      { modelField: 'Age', modelType: 'number' },
      { modelField: 'Gender', modelType: 'select' },
      { modelField: 'Tenure', modelType: 'number' },
      { modelField: 'Unmapped', modelType: 'text' },
    ];

    const stats = service.calculateMappingStats(mappings, features);
    
    expect(stats.mapped).toBe(2);
    expect(stats.total).toBe(4);
    expect(stats.percentage).toBe(50);
  });

  test('saveMappings filters out not_mapped entries', async () => {
    const mappings: PredictionMapping = {
      mappings: [
        { modelField: 'Age', tenantField: 'customer_age' },
        { modelField: 'Gender', tenantField: 'not_mapped' },
        { modelField: 'Tenure', tenantField: 'customer_tenure' },
      ]
    };

    await service.saveMappings(mappings);
    
    // Check the mock repository received filtered mappings
    expect(repository.mockData.mappings).toHaveLength(2);
    expect(repository.mockData.mappings.some(
      m => m.modelField === 'Gender' && m.tenantField === 'not_mapped'
    )).toBe(false);
  });
});
