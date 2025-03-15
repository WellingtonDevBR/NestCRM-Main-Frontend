
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
    // Basic validation before making API call
    if (!subdomain || subdomain.length < 3) {
      return false;
    }
    
    // Server-side availability check
    return await checkSubdomainAvailability(subdomain);
  };
  
  const createOrganization = async (name: string, subdomain: string): Promise<Organization | null> => {
    if (!userId) {
      toast.error('You must be logged in to create an organization');
      return null;
    }

    try {
      // Clean the subdomain first to ensure it's valid format
      const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
      
      // Check if the subdomain is available
      const isAvailable = await isValidSubdomain(cleanSubdomain);
      if (!isAvailable) {
        toast.error('This subdomain is already taken or invalid');
        return null;
      }

      // Create the organization
      const newOrg = await createNewOrganization(name, cleanSubdomain, userId);
      
      // Update local state
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
