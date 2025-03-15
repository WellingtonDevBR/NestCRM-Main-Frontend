
import { useEffect } from 'react';
import type { Organization } from '@/types/supabase';

/**
 * Hook for handling organization authentication effects
 */
export function useOrganizationAuthEffect({
  isAuthenticated,
  setCurrentOrganization,
  setOrganizations
}: {
  isAuthenticated: boolean;
  setCurrentOrganization: (org: Organization | null) => void;
  setOrganizations: (orgs: Organization[]) => void;
}) {
  // Clear organization state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, clearing organization state');
      setCurrentOrganization(null);
      setOrganizations([]);
    }
  }, [isAuthenticated, setCurrentOrganization, setOrganizations]);
}
