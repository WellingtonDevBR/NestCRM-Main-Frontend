
import { useState, useEffect } from 'react';
import { PredictionMapping } from '@/domain/models/predictionMapping';
import { calculateMappingStats } from '@/domain/utils/predictionMappingUtils';

export function usePredictionMappingState(
  initialMappings?: PredictionMapping,
  activeFeatures?: { modelField: string }[]
) {
  // Local state for mappings
  const [localMappings, setLocalMappings] = useState<PredictionMapping>({ mappings: [] });
  const [isModified, setIsModified] = useState(false);
  
  // Initialize local state from API data
  useEffect(() => {
    if (initialMappings && initialMappings.mappings) {
      console.log("Setting localMappings from initialMappings:", initialMappings);
      setLocalMappings(initialMappings);
      setIsModified(false);
    }
  }, [initialMappings]);

  // Calculate mapping statistics
  const getMappingStats = () => {
    if (!activeFeatures) return { mapped: 0, total: 0, mappingProgress: 0 };
    
    const { mapped, total } = calculateMappingStats(localMappings, activeFeatures);
    const mappingProgress = total > 0 ? Math.round((mapped / total) * 100) : 0;
    
    return { mapped, total, mappingProgress };
  };

  return {
    localMappings,
    setLocalMappings,
    isModified,
    setIsModified,
    getMappingStats
  };
}
