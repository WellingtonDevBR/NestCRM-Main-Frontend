
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
      if (authLoading || orgLoading) return;

      const subdomain = getSubdomainFromUrl();
      
      // On the main domain (nestcrm.com.au), there's no subdomain or the subdomain is 'www' or 'nestcrm'
      const isOnMainDomain = isMainDomain(subdomain);
      const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
      
      console.log('TenantRedirector: Checking tenant', { 
        subdomain, 
        isOnMainDomain, 
        isAuthPath, 
        isAuthenticated, 
        organizationsCount: organizations.length,
        currentPath: location.pathname
      });
      
      // If we're on the main domain, don't do tenant access checks
      if (isOnMainDomain) {
        // If trying to access auth pages while logged in on main domain, redirect to organizations page
        if (isAuthenticated && isAuthPath) {
          navigate('/organizations');
        }
        // If on main domain and authenticated but no organizations exist, redirect to onboarding
        else if (isAuthenticated && organizations.length === 0 && 
                location.pathname !== '/onboarding' && 
                location.pathname !== '/create-organization') {
          navigate('/onboarding');
        }
      } 
      // We are on a tenant subdomain
      else {
        // If on a specific organization subdomain but not authenticated, allow access to auth pages
        if (!isAuthenticated && isAuthPath) {
          // This is fine, let them access the login/signup page on the subdomain
          console.log('Allowing unauthenticated access to auth page on subdomain');
        } 
        // If on a specific organization subdomain but no currentOrganization loaded
        else if (!currentOrganization && !orgLoading && subdomain) {
          // Only show error for authenticated users, as they should have organization access
          if (isAuthenticated && organizations.length > 0 && !hasShownMessage) {
            console.log('User has organizations but no access to this subdomain:', subdomain);
            toast.error('You do not have access to this organization');
            setHasShownMessage(true);
          } else {
            console.log(`Invalid tenant or no access for subdomain: ${subdomain}`);
          }
        }
      }

      // Refresh organizations with retry logic if authenticated and no organizations loaded
      if (isAuthenticated && organizations.length === 0) {
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
    organizations.length,
    currentOrganization,
    hasShownMessage,
    lastCheckTime
  ]);

  if (isChecking) {
    // Simple loading state while checking tenant
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return <>{children}</>;
};
