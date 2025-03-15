
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { 
  getSubdomainFromUrl, 
  isMainDomain 
} from '@/utils/domainUtils';
import { 
  fetchOrganizationBySubdomain,
  fetchUserOrganizations,
  checkSubdomainAvailability,
  createNewOrganization,
  updateOrganizationDetails
} from '@/services/organizationService';

interface UseOrganizationStateProps {
  userId: string | undefined;
  isAuthenticated: boolean;
}

export function useOrganizationState({ userId, isAuthenticated }: UseOrganizationStateProps) {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  const isValidSubdomain = async (subdomain: string): Promise<boolean> => {
    return await checkSubdomainAvailability(subdomain);
  };

  const fetchOrganizations = async (): Promise<void> => {
    if (!userId) return;

    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    const initializeOrganization = async () => {
      setLoading(true);
      try {
        const subdomain = getSubdomainFromUrl();
        const hostname = window.location.hostname;
        
        console.log(`Initializing organization with hostname: "${hostname}", subdomain: "${subdomain || 'none'}"`);
        
        // Only fetch organization by subdomain if we're on a tenant subdomain, not the main domain
        if (subdomain && !isMainDomain(subdomain)) {
          console.log(`Fetching organization by subdomain: ${subdomain}`);
          const org = await fetchOrganizationBySubdomain(subdomain);
          if (org) {
            setCurrentOrganization(org);
            console.log('Successfully set current organization:', org.name);
          } else {
            console.log('No organization found for subdomain:', subdomain);
          }
        } else {
          console.log('On main domain, not fetching by subdomain');
        }
        
        // If authenticated, always fetch the user's organizations
        if (isAuthenticated) {
          await fetchOrganizations();
        } else {
          setOrganizations([]);
          if (isMainDomain(subdomain)) {
            setCurrentOrganization(null);
          }
        }
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
  }, [isAuthenticated, userId, initializationAttempts]);

  return {
    currentOrganization,
    organizations,
    loading,
    createOrganization,
    switchOrganization,
    updateOrganization,
    fetchOrganizations,
    isValidSubdomain,
    setInitializationAttempts
  };
}
