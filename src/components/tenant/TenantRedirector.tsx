
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { useTenantChecker } from './hooks/useTenantChecker';
import { useSubdomainValidation } from './hooks/useSubdomainValidation';
import { useSubdomainRedirect } from './hooks/useSubdomainRedirect';
import { useCrossDomainAuth } from './hooks/useCrossDomainAuth';
import { TenantChecker } from './TenantChecker';

interface TenantRedirectorProps {
  children: ReactNode;
}

/**
 * Main component that handles tenant redirections and access control
 */
export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { isAuthenticated } = useAuth();
  const { initialized: orgInitialized } = useOrganization();
  const location = useLocation();
  
  // Apply all our custom hooks
  const { isChecking, checkAttempts } = useTenantChecker();
  useSubdomainValidation();
  useSubdomainRedirect();
  useCrossDomainAuth();

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
