
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { 
  fetchUserOrganizations,
  updateOrganizationDetails 
} from '@/services/organizationService';

interface UseOrganizationManagementProps {
  userId: string | undefined;
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  setCurrentOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
  currentOrganization: Organization | null;
  organizations: Organization[];
}

/**
 * Hook for managing operations on existing organizations
 */
export function useOrganizationManagement({
  userId,
  setOrganizations,
  setCurrentOrganization,
  currentOrganization,
  organizations
}: UseOrganizationManagementProps) {
  
  const fetchOrganizations = async (): Promise<void> => {
    if (!userId) return;

    try {
      const orgs = await fetchUserOrganizations(userId);
      setOrganizations(orgs);
      
      const subdomain = getSubdomainFromUrl();
      const hostname = window.location.hostname;
      
      // Check if we're on a tenant subdomain (not the main domain)
      if (subdomain && !isMainDomain(subdomain)) {
        console.log(`Looking for organization matching subdomain: ${subdomain}`);
        // We're on a specific organization subdomain - find the matching org
        const subdomainOrg = orgs.find(org => org.subdomain === subdomain);
        if (subdomainOrg) {
          console.log(`Found matching organization: ${subdomainOrg.name}`);
          setCurrentOrganization(subdomainOrg);
        } else if (orgs.length > 0) {
          // User doesn't have access to this subdomain org, but has other orgs
          console.log(`No matching organization for subdomain. Using first available: ${orgs[0].name}`);
          setCurrentOrganization(orgs[0]);
        }
      } else {
        console.log(`On main domain (${hostname}). ${orgs.length > 0 ? `Setting first org as current: ${orgs[0].name}` : 'No orgs available'}`);
        // We're on the main domain - set the first org as current if available
        if (orgs.length > 0) {
          setCurrentOrganization(orgs[0]);
        }
      }
    } catch (error: any) {
      console.error('Error fetching organizations:', error);
      
      // Special handling for the infinite recursion error
      if (error.message && error.message.includes('infinite recursion')) {
        toast.error('Database policy error. Please contact support.',
          { description: 'There was an issue with database permissions.' });
      } else {
        toast.error('Failed to load organizations');
      }
      
      setOrganizations([]);
      setCurrentOrganization(null);
    }
  };

  const switchOrganization = async (organizationId: string): Promise<void> => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      toast.success(`Switched to ${org.name}`);
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<void> => {
    try {
      await updateOrganizationDetails(id, updates);

      setOrganizations(prev => 
        prev.map(org => org.id === id ? { ...org, ...updates } : org)
      );
      
      if (currentOrganization?.id === id) {
        setCurrentOrganization(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Organization updated successfully');
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization', {
        description: error.message
      });
    }
  };
  
  return {
    fetchOrganizations,
    switchOrganization,
    updateOrganization
  };
}

// Import these functions here to avoid circular dependency
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
