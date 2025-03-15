
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubdomainFromUrl, isMainDomain, buildSubdomainUrl } from '@/utils/domainUtils';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';

interface UseSubdomainRedirectProps {
  skipIndexRedirect?: boolean;
}

/**
 * Hook that handles redirecting customer subdomains
 */
export const useSubdomainRedirect = ({ skipIndexRedirect = false }: UseSubdomainRedirectProps = {}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOrganization } = useOrganization();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const subdomain = getSubdomainFromUrl();
    
    // If there's a valid subdomain and we're on the index page, and not skipping index redirects
    if (subdomain && 
        !isMainDomain(subdomain) && 
        !skipIndexRedirect && 
        (location.pathname === '/' || location.pathname === '/index.html')) {
      console.log('🔄 Subdomain on index: Redirecting subdomain to dashboard', subdomain);
      navigate('/dashboard', { replace: true });
    }
    
    // Always redirect dashboard access to the correct subdomain
    if (location.pathname === '/dashboard' && isAuthenticated) {
      // If we have a current organization and we're not already on its subdomain
      if (currentOrganization && 
          currentOrganization.subdomain && 
          subdomain !== currentOrganization.subdomain) {
        
        console.log('🔄 Dashboard redirect: Redirecting to organization subdomain', currentOrganization.subdomain);
        // Use full URL redirect to change domain
        window.location.href = buildSubdomainUrl(currentOrganization.subdomain, '/dashboard');
      }
    }
  }, [location.pathname, navigate, skipIndexRedirect, isAuthenticated, currentOrganization]);
};
