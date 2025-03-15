
import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { useTenantChecker } from './hooks/useTenantChecker';
import { useSubdomainValidation } from './hooks/useSubdomainValidation';
import { useSubdomainRedirect } from './hooks/useSubdomainRedirect';
import { useCrossDomainAuth } from './hooks/useCrossDomainAuth';
import { TenantChecker } from './TenantChecker';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import { toast } from 'sonner';

interface TenantRedirectorProps {
  children: ReactNode;
}

/**
 * Main component that handles tenant redirections and access control
 */
export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { isAuthenticated } = useAuth();
  const { initialized: orgInitialized, currentOrganization } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Apply all our custom hooks
  const { isChecking, checkAttempts } = useTenantChecker();
  useSubdomainValidation();
  
  // IMPORTANT: We're no longer skipping index redirects!
  // This ensures tenant subdomain users are redirected from index page
  useSubdomainRedirect({ skipIndexRedirect: false });
  useCrossDomainAuth();

  // Get subdomain information
  const subdomain = getSubdomainFromUrl();
  const onMainDomain = isMainDomain(subdomain);
  
  // Enhanced subdomain access restriction
  useEffect(() => {
    // Only apply restrictions if we're on a subdomain (not main domain)
    if (subdomain && !onMainDomain) {
      // List of restricted routes that subdomain users shouldn't access
      const restrictedRoutes = ['/login', '/signup', '/organizations', '/create-organization', '/onboarding'];
      
      // Check if current path is a restricted route
      const isRestrictedRoute = restrictedRoutes.some(route => location.pathname === route);
      
      if (isRestrictedRoute) {
        console.log(`🔒 Security: Blocking subdomain access to restricted route: ${location.pathname}`);
        toast.error("This page is not available on organization subdomains");
        
        // Redirect to dashboard if authenticated, otherwise to main domain
        if (isAuthenticated) {
          navigate('/dashboard', { replace: true });
        } else {
          window.location.href = `${window.location.protocol}//${import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173'}`;
        }
      }
    }
  }, [subdomain, onMainDomain, location.pathname, isAuthenticated, navigate]);

  // Enhanced main domain dashboard protection
  // If we're on the main domain and trying to access /dashboard, block it and redirect
  const isDashboardPath = location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/');
  
  if (isDashboardPath && onMainDomain) {
    // If authenticated but on main domain trying to access dashboard, redirect to organizations
    if (isAuthenticated && orgInitialized) {
      console.log("🚫 Blocking main domain dashboard access, redirecting to proper location");
      navigate(currentOrganization ? '/organizations' : '/', { replace: true });
    }
    // If not authenticated and trying to access dashboard, redirect to login
    else if (!isAuthenticated && !isChecking) {
      console.log("🚫 Unauthenticated dashboard access, redirecting to home");
      navigate('/', { replace: true });
    }
  }

  // Don't show loading spinner for public pages or when organization is initialized
  const isPublicPage = location.pathname === '/' || 
                      location.pathname === '/index.html' || 
                      location.pathname === '/login' || 
                      location.pathname === '/signup' || 
                      location.pathname === '/organizations';
                      
  // Fast path for main domain - show content immediately
  if (window.__MAIN_DOMAIN_DETECTED && location.pathname === '/') {
    console.log("🔍 Optimization: Main domain fast path - rendering children immediately");
    return <>{children}</>;
  }
                      
  if (isChecking && !isPublicPage && checkAttempts < 3 && !orgInitialized) {
    console.log(`🔄 Loading: Showing loading spinner while checking tenant... (attempt ${checkAttempts + 1})`);
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  console.log("🔄 Rendering: TenantRedirector - Rendering children");
  return (
    <TenantChecker>
      {children}
    </TenantChecker>
  );
};
