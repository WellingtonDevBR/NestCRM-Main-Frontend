
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubdomainFromUrl, isMainDomain, buildSubdomainUrl } from '@/utils/domainUtils';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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
    
    // If there's no subdomain or we're on the main domain, no need to restrict access
    if (!subdomain || isMainDomain(subdomain)) {
      return;
    }
    
    // List of allowed paths for subdomain users
    const allowedPaths = ['/dashboard', '/not-found'];
    const isDashboardSubpath = location.pathname.startsWith('/dashboard/');
    const isAllowedPath = allowedPaths.includes(location.pathname) || isDashboardSubpath;
    
    // Special case for login path - redirect to main domain login
    if (location.pathname === '/login') {
      console.log('🔒 Security: Login on subdomain - redirecting to main domain login');
      window.location.href = `${window.location.protocol}//${import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173'}/login`;
      return;
    }
    
    // For subdomain access to unauthorized pages
    if (!isAllowedPath) {
      console.log(`🔒 Security: Restricted subdomain access to path: ${location.pathname}`);
      
      // If user is authenticated, redirect to dashboard
      if (isAuthenticated) {
        toast.info("Redirecting to dashboard...");
        navigate('/dashboard', { replace: true });
        return;
      } 
      // If not authenticated, redirect to main domain login
      else {
        toast.info("Redirecting to login...");
        window.location.href = `${window.location.protocol}//${import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173'}/login`;
        return;
      }
    }
    
    // Index page specific redirect 
    if ((location.pathname === '/' || location.pathname === '/index.html') && !skipIndexRedirect) {
      console.log('🔄 Subdomain on index: Redirecting tenant to dashboard', subdomain);
      
      if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Redirect unauthenticated users to main domain login
        toast.info("Redirecting to login...");
        window.location.href = `${window.location.protocol}//${import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173'}/login`;
      }
      return;
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
