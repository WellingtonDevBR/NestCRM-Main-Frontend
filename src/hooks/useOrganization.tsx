
import { useContext } from 'react';
import { OrganizationContext } from '@/contexts/OrganizationContext';

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}

// Re-export the provider for convenience
export { OrganizationProvider } from '@/contexts/OrganizationContext';
