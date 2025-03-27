
import { 
  LIGHT_FEATURES, 
  FULL_FEATURES, 
  ModelFeature 
} from '@/domain/models/predictionMapping';

describe('Prediction Mapping Domain Model', () => {
  test('LIGHT_FEATURES should contain the expected number of features', () => {
    expect(LIGHT_FEATURES.length).toBe(6);
  });

  test('FULL_FEATURES should include all lightweight features', () => {
    // Check that all lightweight features are included in full features
    const allLightFeaturesIncluded = LIGHT_FEATURES.every(
      lightFeature => FULL_FEATURES.some(
        fullFeature => fullFeature.modelField === lightFeature.modelField
      )
    );

    expect(allLightFeaturesIncluded).toBe(true);
  });

  test('FULL_FEATURES should have more features than LIGHT_FEATURES', () => {
    expect(FULL_FEATURES.length).toBeGreaterThan(LIGHT_FEATURES.length);
  });

  test('All features should have required modelField property', () => {
    const allFeaturesHaveModelField = [...LIGHT_FEATURES, ...FULL_FEATURES].every(
      feature => typeof feature.modelField === 'string' && feature.modelField.length > 0
    );
    
    expect(allFeaturesHaveModelField).toBe(true);
  });

  test('Each ModelFeature should have correct structure', () => {
    const validateFeature = (feature: ModelFeature) => {
      expect(typeof feature.modelField).toBe('string');
      
      if (feature.modelType) {
        expect(['number', 'select', 'text']).toContain(feature.modelType);
      }
      
      if (feature.description) {
        expect(typeof feature.description).toBe('string');
      }
    };

    // Test both feature sets
    LIGHT_FEATURES.forEach(validateFeature);
    FULL_FEATURES.forEach(validateFeature);
  });
});
