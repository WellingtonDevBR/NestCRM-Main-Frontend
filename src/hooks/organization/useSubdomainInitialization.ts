
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import { fetchOrganizationBySubdomain } from '@/services/organizationService';
import type { Organization } from '@/types/supabase';

/**
 * Hook for handling subdomain-based organization initialization
 */
export async function initializeBySubdomain({
  isAuthenticated,
  userId,
  setCurrentOrganization
}: {
  isAuthenticated: boolean;
  userId: string | undefined;
  setCurrentOrganization: (org: Organization | null) => void;
}): Promise<void> {
  const subdomain = getSubdomainFromUrl();
  const hostname = window.location.hostname;
  
  console.log(`Initializing organization with hostname: "${hostname}", subdomain: "${subdomain || 'none'}"`);
  
  // CRITICAL FIX: Never set an organization for unauthenticated users
  if (!isAuthenticated) {
    console.log('User not authenticated, clearing organization state');
    setCurrentOrganization(null);
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
}
