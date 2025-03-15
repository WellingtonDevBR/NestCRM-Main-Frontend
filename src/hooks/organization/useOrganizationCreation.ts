
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { 
  checkSubdomainAvailability,
  createNewOrganization 
} from '@/services/organizationService';

interface UseOrganizationCreationProps {
  userId: string | undefined;
  setOrganizations: (updater: (prev: Organization[]) => Organization[]) => void;
  setCurrentOrganization: (org: Organization | null) => void;
}

/**
 * Hook for handling organization creation operations
 */
export function useOrganizationCreation({ 
  userId, 
  setOrganizations, 
  setCurrentOrganization 
}: UseOrganizationCreationProps) {
  
  const isValidSubdomain = async (subdomain: string): Promise<boolean> => {
    return await checkSubdomainAvailability(subdomain);
  };
  
  const createOrganization = async (name: string, subdomain: string): Promise<Organization | null> => {
    if (!userId) {
      toast.error('You must be logged in to create an organization');
      return null;
    }

    try {
      const isAvailable = await isValidSubdomain(subdomain);
      if (!isAvailable) {
        toast.error('This subdomain is already taken');
        return null;
      }

      const newOrg = await createNewOrganization(name, subdomain, userId);
      
      setOrganizations(prev => [...prev, newOrg]);
      setCurrentOrganization(newOrg);
      
      toast.success('Organization created successfully');
      return newOrg;
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization', {
        description: error.message
      });
      return null;
    }
  };
  
  return {
    createOrganization,
    isValidSubdomain
  };
}
