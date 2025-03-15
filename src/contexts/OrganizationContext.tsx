
import { createContext, ReactNode } from 'react';
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
  const { user, isAuthenticated } = useAuth();
  const organizationState = useOrganizationState({
    userId: user?.id,
    isAuthenticated
  });

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization: organizationState.currentOrganization,
        organizations: organizationState.organizations,
        loading: organizationState.loading,
        initialized: organizationState.initialized,
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
