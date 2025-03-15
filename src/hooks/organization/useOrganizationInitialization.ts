
import { useEffect } from 'react';
import type { Organization } from '@/types/supabase';
import { useOrganizationInitializationState } from './useOrganizationInitializationState';
import { useOrganizationAuthEffect } from './useOrganizationAuthEffect';
import { useMainDomainInitialization } from './useMainDomainInitialization';
import { initializeBySubdomain } from './useSubdomainInitialization';
import { initializeUserOrganizations } from './useUserOrganizations';

interface UseOrganizationInitializationProps {
  userId: string | undefined;
  isAuthenticated: boolean;
  skipInitialization?: boolean;
  setCurrentOrganization: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
}

/**
 * Hook for handling organization initialization and loading
 */
export function useOrganizationInitialization({ 
  userId, 
  isAuthenticated, 
  skipInitialization = false,
  setCurrentOrganization,
  setOrganizations
}: UseOrganizationInitializationProps) {
  // Use the state hook
  const {
    loading,
    setLoading,
    initializationAttempts,
    setInitializationAttempts,
    initialized,
    setInitialized
  } = useOrganizationInitializationState(skipInitialization);

  // Apply auth effect
  useOrganizationAuthEffect({
    isAuthenticated,
    setCurrentOrganization,
    setOrganizations
  });

  // Function to initialize organizations when the app loads
  useEffect(() => {
    // Check if we can skip initialization
    const canSkipInit = useMainDomainInitialization(skipInitialization);
    if (canSkipInit) {
      setInitialized(true);
      setLoading(false);
      return;
    }
    
    const initializeOrganization = async () => {
      setLoading(true);
      try {
        // Handle subdomain-based initialization
        await initializeBySubdomain({
          isAuthenticated,
          userId,
          setCurrentOrganization
        });
        
        // Fetch and handle user organizations
        await initializeUserOrganizations({
          isAuthenticated,
          userId,
          setOrganizations,
          setCurrentOrganization
        });
        
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing organization:', error);
        // If we fail, increment the retry counter
        setInitializationAttempts(prev => prev + 1);
      } finally {
        setLoading(false);
      }
    };

    initializeOrganization();
    
    // Set up a retry mechanism for initialization issues
    if (initializationAttempts > 0 && initializationAttempts < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`Retrying organization initialization (attempt ${initializationAttempts + 1})...`);
        initializeOrganization();
      }, 2000); // Wait 2 seconds before retry
      
      return () => clearTimeout(retryTimeout);
    }
  }, [
    isAuthenticated, 
    userId, 
    initializationAttempts, 
    skipInitialization,
    setCurrentOrganization,
    setOrganizations,
    setLoading,
    setInitialized,
    setInitializationAttempts
  ]);

  return {
    loading,
    initialized,
    setInitializationAttempts
  };
}
