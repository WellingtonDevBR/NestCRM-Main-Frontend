
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import { initializeIndexPageOrganization } from '@/utils/organizationUtils';
import { redirectToOrganization } from '@/utils/organizationUtils';
import { supabase } from '@/integrations/supabase/client';

interface TenantRedirectorProps {
  children: React.ReactNode;
}

// Import main domain constant from utils
import { MAIN_DOMAIN } from '@/utils/domainUtils';

export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { 
    organizations, 
    currentOrganization, 
    loading: orgLoading, 
    initialized: orgInitialized,
    fetchOrganizations 
  } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Log component lifecycle
  useEffect(() => {
    console.log('🔄 TenantRedirector: Component mounted/updated');
    console.log('🔄 TenantRedirector: Auth state -', isAuthenticated ? 'Authenticated' : 'Not authenticated');
    console.log('🔄 TenantRedirector: Current path -', location.pathname);
    
    return () => {
      console.log('🔄 TenantRedirector: Component unmounting');
    };
  }, [isAuthenticated, location.pathname]);

  // CRITICAL FIX: Reset hasRedirected when authentication state changes
  useEffect(() => {
    if (!isAuthenticated) {
      setHasRedirected(false);
    }
  }, [isAuthenticated]);

  // Original tenant redirector logic
  useEffect(() => {
    // Early exit for main domain optimization
    // This ensures immediate rendering on the main domain
    if (window.__MAIN_DOMAIN_DETECTED && location.pathname === '/') {
      console.log('🔍 Optimization: Main domain fast path detected - bypassing all tenant checks');
      setIsChecking(false);
      return;
    }
    
    // CRITICAL FIX - Always render public paths and organization page immediately
    const publicPaths = ['/', '/index.html', '/login', '/signup', '/not-found', '/organizations'];
    if (publicPaths.includes(location.pathname)) {
      console.log('🔍 Routing: Public path detected - bypassing tenant checks');
      setIsChecking(false);
      return;
    }
    
    // CRITICAL FIX: Never redirect unauthenticated users to subdomains
    if (!isAuthenticated) {
      console.log('🔍 Security: User not authenticated, not performing tenant checks');
      setIsChecking(false);
      return;
    }
    
    // Prevent running checks too frequently
    const now = Date.now();
    if (now - lastCheckTime < 1000) {
      return;
    }
    setLastCheckTime(now);

    const checkTenant = async () => {
      try {
        if (authLoading || orgLoading) {
          console.log("🔄 Loading: Still loading auth or organizations...");
          return;
        }

        // Increment check attempts to implement retry mechanism
        setCheckAttempts(prev => prev + 1);

        const subdomain = getSubdomainFromUrl();
        const hostname = window.location.hostname;
        
        console.log(`🔍 Tenant: TenantRedirector checking - hostname: "${hostname}", subdomain: "${subdomain || 'none'}", attempt: ${checkAttempts + 1}`);
        
        // CRITICAL: Organizations page should always be accessible without redirection
        if (location.pathname === '/organizations') {
          console.log('🔍 Routing: On organizations page, allowing access without tenant checks');
          setIsChecking(false);
          return;
        }

        // Handle 404 routing properly - allow NotFound page to render
        if (location.pathname === '/not-found') {
          console.log("🔍 Routing: 404 page detected, allowing access");
          setIsChecking(false);
          return;
        }
      } catch (error) {
        console.error('❌ Error: Error in TenantRedirector:', error);
      } finally {
        setIsChecking(false);
      }
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
    lastCheckTime,
    checkAttempts,
    orgInitialized,
    hasRedirected,
    navigate
  ]);

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
  return <>{children}</>;
};
