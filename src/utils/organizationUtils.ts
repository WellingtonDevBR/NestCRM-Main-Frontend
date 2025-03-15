import { supabase } from '@/integrations/supabase/client';
import type { Organization } from '@/types/supabase';
import { getSubdomainFromUrl, buildSubdomainUrl } from './domainUtils';

/**
 * Redirects the user to the appropriate URL for their organization
 * @param organization The organization to redirect to
 * @param path Optional path to include in the URL
 */
export const redirectToOrganization = (
  organization: Organization,
  path: string = '/dashboard'
): void => {
  const subdomain = organization.subdomain;
  const url = buildSubdomainUrl(subdomain, path);
  
  // Use window.location.href for a full page redirect
  window.location.href = url;
};

/**
 * Extracts organization data from the URL if it exists
 * Used for getting current organization context on initial load
 */
export const getOrganizationFromUrl = async (): Promise<Organization | null> => {
  const subdomain = getSubdomainFromUrl();
  
  if (!subdomain) {
    return null;
  }
  
  // Try to fetch organization data from the subdomain
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .maybeSingle();
      
    if (error || !data) {
      console.error('Error fetching organization from subdomain:', error);
      return null;
    }
    
    return data as Organization;
  } catch (error) {
    console.error('Error in getOrganizationFromUrl:', error);
    return null;
  }
};

/**
 * Format organization name for display
 * @param organization The organization object
 * @returns Formatted name string
 */
export const formatOrganizationName = (organization: Organization | null): string => {
  if (!organization) return 'No Organization';
  return organization.name;
};

/**
 * Check if a user has access to an organization
 * @param userId The user ID to check
 * @param organizationId The organization ID to check access for
 * @returns Promise resolving to boolean indicating if user has access
 */
export const checkUserOrganizationAccess = async (
  userId: string | undefined,
  organizationId: string
): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .maybeSingle();
    
    if (error) {
      console.error('Error checking organization access:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkUserOrganizationAccess:', error);
    return false;
  }
};

/**
 * Get the user's role in an organization
 * @param userId The user ID to check
 * @param organizationId The organization ID
 * @returns Promise resolving to the user's role or null
 */
export const getUserOrganizationRole = async (
  userId: string | undefined,
  organizationId: string
): Promise<string | null> => {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .maybeSingle();
    
    if (error || !data) {
      console.error('Error getting user role:', error);
      return null;
    }
    
    return data.role;
  } catch (error) {
    console.error('Error in getUserOrganizationRole:', error);
    return null;
  }
};

/**
 * Initialize the organization context for the main index page
 * Used specifically to ensure the landing page loads correctly regardless of domain
 */
export const initializeIndexPageOrganization = (): boolean => {
  // Get the current pathname
  const pathname = window.location.pathname;
  const hostname = window.location.hostname;
  
  // Special handling for the main domain
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    console.log(`Main domain detected during initialization: ${hostname}`);
    // If we're on the root path or index page, allow immediate rendering
    if (pathname === '/' || pathname === '/index.html') {
      return true;
    }
  }
  
  // Development environment check
  if (hostname.includes('localhost') || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('lovableproject.com') ||
      hostname.includes('netlify.app') ||
      hostname.includes('vercel.app')) {
    // For development, always allow immediate rendering of public pages  
    if (pathname === '/' || pathname === '/index.html' || 
        pathname === '/login' || pathname === '/signup') {
      return true;
    }
  }
  
  // Check if we're on a public route that should bypass organization checks
  return pathname === '/' || pathname === '/index.html';
};
