
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { getSubdomainFromUrl } from '@/utils/domainUtils';

/**
 * Hook that handles the main tenant checking logic
 */
export const useTenantChecker = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { loading: orgLoading, initialized: orgInitialized } = useOrganization();
  const location = useLocation();
  
  const [isChecking, setIsChecking] = useState(true);
  const [lastCheckTime, setLastCheckTime] = useState(0);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const [hasRedirected, setHasRedirected] = useState(false);

  // Reset hasRedirected when authentication state changes
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
    
    // Special handling for auth redirects - always render dashboard immediately
    const searchParams = new URLSearchParams(window.location.search);
    const isAuthRedirect = searchParams.get('auth_redirect') === 'true';
    if (isAuthRedirect && location.pathname === '/dashboard') {
      console.log('🔍 Routing: Auth redirect to dashboard detected - bypassing tenant checks');
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
    lastCheckTime,
    checkAttempts,
    orgInitialized,
    hasRedirected,
    location.search
  ]);

  return { 
    isChecking, 
    checkAttempts,
    orgInitialized
  };
};
