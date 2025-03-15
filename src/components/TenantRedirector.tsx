
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface TenantRedirectorProps {
  children: React.ReactNode;
}

export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { getSubdomainFromUrl } = useOrganization();
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
      
      // Special case for the "nestcrm" subdomain - this should be treated as the root domain
      // since it's part of the base URL (.nestcrm.com.au)
      if (subdomain === 'nestcrm') {
        if (isAuthenticated && location.pathname === '/') {
          navigate('/organizations');
        }
        setIsChecking(false);
        return;
      }

      const isRootDomain = !subdomain;
      const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
      
      console.log('TenantRedirector: Checking tenant', { 
        subdomain, 
        isRootDomain, 
        isAuthPath, 
        isAuthenticated, 
        organizationsCount: organizations.length,
        currentPath: location.pathname
      });
      
      // On the root domain (no subdomain) and authenticated
      if (isRootDomain && isAuthenticated) {
        // If trying to access auth pages while logged in on root domain, redirect to organizations page
        if (isAuthPath) {
          navigate('/organizations');
        }
        // If on root domain and no organizations exist, redirect to onboarding
        else if (organizations.length === 0 && location.pathname !== '/onboarding' && location.pathname !== '/create-organization') {
          navigate('/onboarding');
        }
      }
      
      // Only show the error message when:
      // 1. We're on a subdomain (not the special 'nestcrm' case)
      // 2. The currentOrganization is not loaded (user doesn't have access)
      // 3. User is authenticated
      // 4. User has at least one organization (so they're not in the process of creating their first)
      // 5. We haven't shown the message yet
      if (subdomain && subdomain !== 'nestcrm' && !currentOrganization && isAuthenticated && organizations.length > 0 && !hasShownMessage) {
        console.log('User has organizations but no access to this subdomain:', subdomain);
        toast.error('You do not have access to this organization');
        setHasShownMessage(true);
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
