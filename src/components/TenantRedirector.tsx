
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';

interface TenantRedirectorProps {
  children: React.ReactNode;
}

export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { organizations, currentOrganization, loading: orgLoading, fetchOrganizations } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);

  useEffect(() => {
    // Prevent running checks too frequently
    const now = Date.now();
    if (now - lastCheckTime < 1000) {
      // Don't run the check if it's been less than 1 second since the last check
      return;
    }
    setLastCheckTime(now);

    const checkTenant = async () => {
      if (authLoading || orgLoading) {
        console.log("Still loading auth or organizations...");
        return;
      }

      const subdomain = getSubdomainFromUrl();
      const hostname = window.location.hostname;
      
      console.log(`TenantRedirector - Current hostname: "${hostname}", subdomain: "${subdomain}"`);
      
      // On the main domain (nestcrm.com.au), there's no subdomain or the subdomain is 'www' or 'nestcrm'
      const isOnMainDomain = isMainDomain(subdomain);
      const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
      const isPublicPath = location.pathname === '/' || isAuthPath;
      const isDevelopmentDomain = hostname.includes('localhost') || 
                                  hostname.includes('127.0.0.1') || 
                                  hostname.includes('lovableproject.com');
      
      console.log('TenantRedirector check:', { 
        hostname,
        subdomain, 
        isOnMainDomain, 
        isAuthPath,
        isPublicPath,
        isDevelopmentDomain,
        isAuthenticated, 
        organizationsCount: organizations?.length || 0,
        currentPath: location.pathname
      });
      
      // Always allow access on public paths
      if (isPublicPath) {
        console.log("Public path detected, allowing access");
        setIsChecking(false);
        return;
      }
      
      // If we're on the main domain or a development domain, don't do tenant access checks
      if (isOnMainDomain || isDevelopmentDomain) {
        console.log("We are on the main domain or development URL, allowing access");
        // If trying to access auth pages while logged in on main domain, redirect to organizations page
        if (isAuthenticated && isAuthPath) {
          console.log("Redirecting authenticated user from auth page to organizations page");
          navigate('/organizations');
          return;
        }
        // If on main domain and authenticated but no organizations exist, redirect to onboarding
        else if (isAuthenticated && organizations.length === 0 && 
                location.pathname !== '/onboarding' && 
                location.pathname !== '/create-organization') {
          console.log("Redirecting authenticated user with no organizations to onboarding");
          navigate('/onboarding');
          return;
        }
      } 
      // We are on a tenant subdomain
      else if (subdomain) {
        console.log(`We are on tenant subdomain: ${subdomain}`);
        // If on a specific organization subdomain but not authenticated and trying to access protected pages
        if (!isAuthenticated && !isPublicPath) {
          console.log("Unauthenticated user trying to access protected page on subdomain, redirecting to login");
          navigate('/login');
          return;
        } 
        // If on a specific organization subdomain but no currentOrganization loaded
        else if (isAuthenticated && !currentOrganization && !orgLoading && !isPublicPath) {
          // Only show error for authenticated users, as they should have organization access
          if (organizations.length > 0 && !hasShownMessage) {
            console.log('User has organizations but no access to this subdomain:', subdomain);
            toast.error('You do not have access to this organization');
            setHasShownMessage(true);
          } else {
            console.log(`Invalid tenant or no access for subdomain: ${subdomain}`);
          }
        }
      }

      // Refresh organizations with retry logic if authenticated and no organizations loaded
      if (isAuthenticated && organizations.length === 0 && !isChecking) {
        console.log("Attempting to fetch organizations for authenticated user");
        try {
          await fetchOrganizations();
        } catch (error) {
          console.error('Failed to fetch organizations:', error);
        }
      }

      setIsChecking(false);
    };

    checkTenant();
  }, [
    authLoading, 
    orgLoading, 
    location.pathname, 
    isAuthenticated, 
    organizations?.length,
    currentOrganization,
    hasShownMessage,
    lastCheckTime
  ]);

  // Don't show loading spinner for public pages
  const isPublicPage = location.pathname === '/' || 
                       location.pathname === '/login' || 
                       location.pathname === '/signup';
                       
  if (isChecking && !isPublicPage) {
    console.log("Showing loading spinner while checking tenant...");
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  console.log("TenantRedirector - Rendering children");
  return <>{children}</>;
};
