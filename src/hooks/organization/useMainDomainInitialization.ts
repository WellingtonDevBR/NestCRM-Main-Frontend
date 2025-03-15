
import { initializeIndexPageOrganization } from '@/utils/organizationUtils';

/**
 * Hook containing logic for main domain initialization
 * Returns true if initialization should be skipped
 */
export function useMainDomainInitialization(
  skipInitialization: boolean
): boolean {
  // Skip initialization if requested (for main domain optimization)
  if (skipInitialization) {
    console.log('Skipping organization initialization due to skipInitialization flag');
    return true;
  }
  
  // Check if this is the main index page - if so, it's okay to have no organization
  const isIndexPage = initializeIndexPageOrganization();
  if (isIndexPage) {
    console.log('Initializing on index page - no organization needed');
    return true;
  }
  
  return false;
}
