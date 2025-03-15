
import { useState } from 'react';
import type { Organization } from '@/types/supabase';
import { useOrganizationInitialization } from './organization/useOrganizationInitialization';
import { useOrganizationCreation } from './organization/useOrganizationCreation';
import { useOrganizationManagement } from './organization/useOrganizationManagement';

interface UseOrganizationStateProps {
  userId: string | undefined;
  isAuthenticated: boolean;
  skipInitialization?: boolean;
}

/**
 * Main hook that composes all organization-related functionality
 */
export function useOrganizationState({ 
  userId, 
  isAuthenticated, 
  skipInitialization = false 
}: UseOrganizationStateProps) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  
  // Initialization hook
  const { 
    loading, 
    initialized, 
    setInitializationAttempts 
  } = useOrganizationInitialization({
    userId,
    isAuthenticated,
    skipInitialization,
    setCurrentOrganization,
    setOrganizations
  });
  
  // Organization creation hook
  const { 
    createOrganization, 
    isValidSubdomain 
  } = useOrganizationCreation({
    userId,
    setOrganizations,
    setCurrentOrganization
  });
  
  // Organization management hook
  const { 
    fetchOrganizations, 
    switchOrganization, 
    updateOrganization 
  } = useOrganizationManagement({
    userId,
    setOrganizations,
    setCurrentOrganization,
    currentOrganization,
    organizations
  });

  return {
    // Organization state
    currentOrganization,
    organizations,
    loading,
    initialized,
    
    // Organization creation
    createOrganization,
    isValidSubdomain,
    
    // Organization management
    fetchOrganizations,
    switchOrganization,
    updateOrganization,
    
    // Initialization control
    setInitializationAttempts
  };
}
