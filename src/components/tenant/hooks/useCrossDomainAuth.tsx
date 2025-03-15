
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook for handling cross-domain authentication redirects
 */
export const useCrossDomainAuth = () => {
  const { isAuthenticated } = useAuth();
  const { organizations, currentOrganization } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a subdomain auth redirect
    const searchParams = new URLSearchParams(window.location.search);
    const isAuthRedirect = searchParams.get('auth_redirect') === 'true';
    const orgId = searchParams.get('org_id');
    
    if (isAuthRedirect && isAuthenticated) {
      console.log('🔑 Cross-domain auth: Detected authentication redirect');
      
      // If we have a valid session already, clean up the URL
      if (location.pathname === '/dashboard') {
        console.log('🔑 Cross-domain auth: Cleaning up URL after successful redirect');
        navigate('/dashboard', { replace: true });
      }
      
      // If org_id is in URL and we don't have a current organization set
      if (orgId && !currentOrganization && organizations.length > 0) {
        console.log('🔑 Cross-domain auth: Setting organization from URL parameter');
        const org = organizations.find(o => o.id === orgId);
        if (org) {
          // This will be handled by the organization context
          console.log('🔑 Cross-domain auth: Found matching organization:', org.name);
        }
      }
    }
  }, [location.search, isAuthenticated, location.pathname, navigate, currentOrganization, organizations]);
};
