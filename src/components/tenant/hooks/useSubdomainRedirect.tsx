
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';

/**
 * Hook that handles redirecting customer subdomains away from index page
 */
export const useSubdomainRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const subdomain = getSubdomainFromUrl();
    
    // If there's a valid subdomain and we're on the index page, redirect to dashboard
    if (subdomain && !isMainDomain(subdomain) && (location.pathname === '/' || location.pathname === '/index.html')) {
      console.log('🔄 Subdomain on index: Redirecting subdomain to dashboard', subdomain);
      navigate('/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);
};
