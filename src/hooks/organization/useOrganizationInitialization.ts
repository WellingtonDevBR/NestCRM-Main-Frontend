
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { 
  getSubdomainFromUrl, 
  isMainDomain 
} from '@/utils/domainUtils';
import { 
  fetchOrganizationBySubdomain,
  fetchUserOrganizations
} from '@/services/organizationService';
import {
  getOrganizationFromUrl,
  initializeIndexPageOrganization
} from '@/utils/organizationUtils';

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
  const [loading, setLoading] = useState<boolean>(!skipInitialization);
  const [initializationAttempts, setInitializationAttempts] = useState(0);
  const [initialized, setInitialized] = useState(skipInitialization);

  // CRITICAL FIX: Clear organization state when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('User not authenticated, clearing organization state');
      setCurrentOrganization(null);
      setOrganizations([]);
    }
  }, [isAuthenticated, setCurrentOrganization, setOrganizations]);

  // Function to initialize organizations when the app loads
  useEffect(() => {
    // Skip initialization if requested (for main domain optimization)
    if (skipInitialization) {
      console.log('Skipping organization initialization due to skipInitialization flag');
      setInitialized(true);
      setLoading(false);
      return;
    }
    
    const initializeOrganization = async () => {
      // Check if this is the main index page - if so, it's okay to have no organization
      const isIndexPage = initializeIndexPageOrganization();
      if (isIndexPage) {
        console.log('Initializing on index page - no organization needed');
        setLoading(false);
        setInitialized(true);
        return;
      }

      setLoading(true);
      try {
        const subdomain = getSubdomainFromUrl();
        const hostname = window.location.hostname;
        
        console.log(`Initializing organization with hostname: "${hostname}", subdomain: "${subdomain || 'none'}"`);
        
        // CRITICAL FIX: Never set an organization for unauthenticated users
        if (!isAuthenticated) {
          console.log('User not authenticated, clearing organization state');
          setCurrentOrganization(null);
          setOrganizations([]);
          setInitialized(true);
          setLoading(false);
          return;
        }
        
        // Only fetch organization by subdomain if we're on a tenant subdomain, not the main domain
        if (subdomain && !isMainDomain(subdomain)) {
          console.log(`Fetching organization by subdomain: ${subdomain}`);
          
          // Only fetch and set organization if user is authenticated
          if (isAuthenticated && userId) {
            const org = await fetchOrganizationBySubdomain(subdomain);
            if (org) {
              setCurrentOrganization(org);
              console.log('Successfully set current organization:', org.name);
            } else {
              console.log('No organization found for subdomain:', subdomain);
              // If no organization is found for this subdomain, don't set any organization
              setCurrentOrganization(null);
            }
          } else {
            // Not authenticated, don't set current organization
            console.log('User not authenticated, not setting organization for subdomain');
            setCurrentOrganization(null);
          }
        } else {
          console.log('On main domain, not fetching by subdomain');
        }
        
        // If authenticated, always fetch the user's organizations
        if (isAuthenticated && userId) {
          const orgs = await fetchUserOrganizations(userId);
          setOrganizations(orgs);
          
          // If we're on main domain and user has orgs but no current org is set, use the first one
          if (isMainDomain(subdomain) && orgs.length > 0 && !subdomain) {
            // CRITICAL FIX: Do not automatically set current organization
            console.log('User has organizations, but not setting current organization automatically');
          }
        } else {
          setOrganizations([]);
          if (isMainDomain(subdomain)) {
            setCurrentOrganization(null);
          }
        }
        
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
  }, [isAuthenticated, userId, initializationAttempts, skipInitialization, setCurrentOrganization, setOrganizations]);

  return {
    loading,
    initialized,
    setInitializationAttempts
  };
}
