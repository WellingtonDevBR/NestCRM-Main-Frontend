
import { useState } from 'react';

/**
 * Hook for managing organization initialization state
 */
export function useOrganizationInitializationState(skipInitialization: boolean = false) {
  const [loading, setLoading] = useState<boolean>(!skipInitialization);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [initialized, setInitialized] = useState(skipInitialization);

  return {
    loading,
    setLoading,
    initializationAttempts,
    setInitializationAttempts,
    initialized,
    setInitialized
  };
}
