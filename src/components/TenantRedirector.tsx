
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';

interface TenantRedirectorProps {
  children: React.ReactNode;
}

export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { getSubdomainFromUrl } = useOrganization();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { organizations, currentOrganization, loading: orgLoading } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkTenant = async () => {
      if (authLoading || orgLoading) return;

      const subdomain = getSubdomainFromUrl();
      const isRootDomain = !subdomain;
      const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
      
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
      if (subdomain && !currentOrganization) {
        // TODO: In production, handle invalid subdomains better
        console.log('Invalid tenant or no access');
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
    currentOrganization
  ]);

  if (isChecking) {
    // Simple loading state while checking tenant
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};
