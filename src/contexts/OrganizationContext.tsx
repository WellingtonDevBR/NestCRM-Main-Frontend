
import { createContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { Organization } from '@/types/supabase';
import { getSubdomainFromUrl } from '@/utils/domainUtils'; 
import { useOrganizationState } from '@/hooks/useOrganizationState';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  initialized: boolean;
  createOrganization: (name: string, subdomain: string) => Promise<Organization | null>;
  switchOrganization: (organizationId: string) => Promise<void>;
  updateOrganization: (id: string, updates: Partial<Organization>) => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  getSubdomainFromUrl: () => string | null;
  isValidSubdomain: (subdomain: string) => Promise<boolean>;
}

export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  // Note: We're maintaining a consistent hook order by initializing all hooks first
  const { user, isAuthenticated } = useAuth();
  
  // Fast path for main domain to avoid unnecessary organization loading
  const [skipOrgLoading, setSkipOrgLoading] = useState(() => {
    if (window.__MAIN_DOMAIN_DETECTED && window.location.pathname === '/') {
      console.log('Main domain fast path for org provider - bypassing organization loading');
      return true;
    }
    return false;
  });
  
  // Handle initialization state in the provider
  const [localInitialized, setLocalInitialized] = useState(skipOrgLoading);
  
  // Then use the state hook with proper dependencies
  const organizationState = useOrganizationState({
    userId: user?.id,
    isAuthenticated,
    skipInitialization: skipOrgLoading
  });
  
  // Effect to ensure we mark local initialization
  useEffect(() => {
    if (organizationState.initialized) {
      setLocalInitialized(true);
    }
  }, [organizationState.initialized]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization: organizationState.currentOrganization,
        organizations: organizationState.organizations,
        loading: skipOrgLoading ? false : organizationState.loading,
        initialized: skipOrgLoading ? true : (localInitialized || organizationState.initialized),
        createOrganization: organizationState.createOrganization,
        switchOrganization: organizationState.switchOrganization,
        updateOrganization: organizationState.updateOrganization,
        fetchOrganizations: organizationState.fetchOrganizations,
        getSubdomainFromUrl,
        isValidSubdomain: organizationState.isValidSubdomain
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}
