
import { fetchUserOrganizations } from '@/services/organizationService';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import type { Organization } from '@/types/supabase';

/**
 * Hook for fetching and setting user organizations
 */
export async function initializeUserOrganizations({
  isAuthenticated,
  userId,
  setOrganizations,
  setCurrentOrganization
}: {
  isAuthenticated: boolean;
  userId: string | undefined;
  setOrganizations: (orgs: Organization[]) => void;
  setCurrentOrganization: (org: Organization | null) => void;
}): Promise<void> {
  const subdomain = getSubdomainFromUrl();
  
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
}
