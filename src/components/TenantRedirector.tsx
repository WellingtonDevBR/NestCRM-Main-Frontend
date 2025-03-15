
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

  useEffect(() => {
    const checkTenant = async () => {
      if (authLoading || orgLoading) return;

      const subdomain = getSubdomainFromUrl();
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
      
      // On a subdomain but the organization doesn't exist or user doesn't have access
      if (subdomain && !currentOrganization && isAuthenticated && !hasShownMessage) {
        console.log('Invalid tenant or no access for subdomain:', subdomain);
        
        // Check if the user has any organizations
        if (organizations.length > 0) {
          // Only show the access error if we've confirmed the user has organizations
          // but doesn't have access to this specific one
          toast.error('You do not have access to this organization');
          setHasShownMessage(true);
        } else {
          // If user has no organizations yet, don't show the error message
          // They might be in the process of creating their first one
          console.log('User has no organizations yet, not showing access error');
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
    hasShownMessage
  ]);

  if (isChecking) {
    // Simple loading state while checking tenant
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return <>{children}</>;
};
