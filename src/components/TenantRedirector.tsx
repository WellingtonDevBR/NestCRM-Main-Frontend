
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

  // Improved function to handle redirection to organization subdomain
  const redirectToSubdomain = async (subdomain: string) => {
    // CRITICAL FIX: Only redirect if user is authenticated
    if (!isAuthenticated) {
      console.log('🚫 Redirection: Blocked redirect attempt for unauthenticated user');
      return;
    }
    
    const protocol = window.location.protocol;
    const url = `${protocol}//${subdomain}.${MAIN_DOMAIN}/dashboard`;
    console.log(`🚀 Redirection: Redirecting to subdomain URL: ${url}`);
    window.location.href = url;
  };

  // Check if user has organizations and redirect if on main domain - but ONLY if authenticated
  useEffect(() => {
    const checkUserOrganizations = async () => {
      // CRITICAL FIX: More explicit check for authentication state
      if (!isAuthenticated || !user?.id) {
        console.log('🔍 Organizations: Skipping organization check - user not authenticated');
        return;
      }
      
      // Skip if already redirected, still loading, or not on main domain
      if (
        hasRedirected || 
        authLoading || 
        !isMainDomain(getSubdomainFromUrl()) ||
        location.pathname === '/onboarding' ||
        location.pathname === '/create-organization' ||
        location.pathname === '/login' ||
        location.pathname === '/signup'
      ) {
        console.log('🔍 Organizations: Skipping organization check due to conditions not met:', {
          hasRedirected,
          isAuthenticated,
          authLoading,
          userId: user?.id ? 'Present' : 'Missing',
          isMainDomain: isMainDomain(getSubdomainFromUrl()),
          path: location.pathname
        });
        return;
      }

      console.log('🔍 Organizations: Checking for user organizations to redirect from main domain...');
      
      try {
        // Direct query to Supabase to get user's organizations
        const { data: memberships, error: membershipError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id);
          
        if (membershipError) {
          console.error('🔍 Organizations: Error fetching user organization memberships:', membershipError);
          return;
        }
        
        console.log('🔍 Organizations: Found memberships:', memberships?.length || 0);
        
        if (memberships && memberships.length > 0) {
          // Get the first organization details
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('*')
            .eq('id', memberships[0].organization_id)
            .single();
            
          if (orgError) {
            console.error('🔍 Organizations: Error fetching organization details:', orgError);
            return;
          }
          
          if (orgData) {
            console.log('🔍 Organizations: Found organization to redirect to:', orgData.name, 'with subdomain:', orgData.subdomain);
            setHasRedirected(true);
            await redirectToSubdomain(orgData.subdomain);
          }
        } else if (location.pathname !== '/onboarding') {
          console.log('🔍 Organizations: No organizations found, redirecting to onboarding');
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('❌ Error: Error in checkUserOrganizations:', error);
      }
    };
    
    // Run the check when authentication status changes
    if (isAuthenticated && user?.id) {
      checkUserOrganizations();
    }
  }, [isAuthenticated, authLoading, user, hasRedirected, location.pathname]);

  // Original tenant redirector logic
  useEffect(() => {
    // Early exit for main domain optimization
    // This ensures immediate rendering on the main domain
    if (window.__MAIN_DOMAIN_DETECTED && location.pathname === '/') {
      console.log('🔍 Optimization: Main domain fast path detected - bypassing all tenant checks');
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
        // CRITICAL FIX: Always render these paths immediately for all users
        const publicPaths = ['/', '/index.html', '/login', '/signup', '/not-found'];
        if (publicPaths.includes(location.pathname)) {
          console.log('🔍 Routing: Public path detected - bypassing tenant checks');
          setIsChecking(false);
          return;
        }
        
        if (authLoading || orgLoading) {
          console.log("🔄 Loading: Still loading auth or organizations...");
          return;
        }

        // Increment check attempts to implement retry mechanism
        setCheckAttempts(prev => prev + 1);

        const subdomain = getSubdomainFromUrl();
        const hostname = window.location.hostname;
        
        console.log(`🔍 Tenant: TenantRedirector checking - hostname: "${hostname}", subdomain: "${subdomain || 'none'}", attempt: ${checkAttempts + 1}`);
        
        // CRITICAL FIX: If not authenticated and on a subdomain, redirect to login
        if (subdomain && !isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
          console.log('🚀 Redirection: Unauthenticated user on subdomain, redirecting to login');
          navigate('/login');
          setIsChecking(false);
          return;
        }
        
        // Determine if we're on the main domain or a development environment
        const isOnMainDomain = isMainDomain(subdomain);
        const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
        const isPublicPath = publicPaths.includes(location.pathname);
        const isDevelopmentDomain = hostname.includes('localhost') || 
                                    hostname.includes('127.0.0.1') || 
                                    hostname.includes('lovableproject.com') ||
                                    hostname.includes('netlify.app') || 
                                    hostname.includes('vercel.app');
        
        console.log('🔍 Tenant: TenantRedirector check details:', { 
          hostname,
          subdomain: subdomain || 'none', 
          isOnMainDomain, 
          isAuthPath,
          isPublicPath,
          isDevelopmentDomain,
          isAuthenticated, 
          organizationsCount: organizations?.length || 0,
          currentPath: location.pathname,
          orgInitialized
        });
        
        // Allow access on public paths
        if (isPublicPath) {
          console.log("🔍 Routing: Public path detected, allowing access");
          setIsChecking(false);
          return;
        }
        
        // Handle 404 routing properly - allow NotFound page to render
        if (location.pathname === '/not-found') {
          console.log("🔍 Routing: 404 page detected, allowing access");
          setIsChecking(false);
          return;
        }
        
        // Handling for main domain or development environment
        if (isOnMainDomain || isDevelopmentDomain || hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
          console.log("🔍 Tenant: Main domain or development URL detected, allowing access");
          
          // Redirect authenticated users from auth pages to organizations
          if (isAuthenticated && isAuthPath) {
            console.log("🚀 Redirection: Redirecting authenticated user from auth page to organizations");
            navigate('/organizations');
            return;
          }
          
          // Redirect users with no organizations to onboarding
          else if (isAuthenticated && organizations.length === 0 && 
                  location.pathname !== '/onboarding' && 
                  location.pathname !== '/create-organization') {
            console.log("🚀 Redirection: Redirecting user with no organizations to onboarding");
            navigate('/onboarding');
            return;
          }
        } 
        // Handling for tenant subdomains
        else if (subdomain) {
          console.log(`🔍 Tenant: Tenant subdomain detected: ${subdomain}`);
          
          // Redirect unauthenticated users on protected pages to login
          if (!isAuthenticated && !isPublicPath) {
            console.log("🚀 Redirection: Redirecting unauthenticated user to login");
            navigate('/login');
            return;
          } 
          
          // Show message for authenticated users without access to this organization
          else if (isAuthenticated && !currentOrganization && !orgLoading && !isPublicPath) {
            if (organizations.length > 0 && !hasShownMessage) {
              console.log('🔍 Access: User has organizations but no access to this subdomain:', subdomain);
              toast.error('You do not have access to this organization');
              setHasShownMessage(true);
            } else {
              console.log(`🔍 Access: Invalid tenant or no access for subdomain: ${subdomain}`);
            }
          }
        }

        // Retry fetching organizations if authenticated and none loaded
        if (isAuthenticated && organizations.length === 0 && !orgLoading) {
          console.log("🔍 Organizations: Attempting to fetch organizations again");
          try {
            await fetchOrganizations();
          } catch (error) {
            console.error('❌ Error: Failed to fetch organizations:', error);
          }
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
    hasRedirected
  ]);

  // Don't show loading spinner for public pages or when organization is initialized
  const isPublicPage = location.pathname === '/' || 
                       location.pathname === '/index.html' || 
                       location.pathname === '/login' || 
                       location.pathname === '/signup';
                       
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
