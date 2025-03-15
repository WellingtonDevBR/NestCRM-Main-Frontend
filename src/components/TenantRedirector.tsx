
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import { initializeIndexPageOrganization } from '@/utils/organizationUtils';
import { redirectToOrganization } from '@/utils/organizationUtils';

interface TenantRedirectorProps {
  children: React.ReactNode;
}

// Import main domain constant from utils
import { MAIN_DOMAIN } from '@/utils/domainUtils';

export const TenantRedirector = ({ children }: TenantRedirectorProps) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  useEffect(() => {
    // Handle redirect to subdomain for authenticated users on main domain
    const redirectAuthenticatedUserToSubdomain = async () => {
      // Skip if already redirected or not on main domain
      if (hasRedirected || location.pathname !== '/' || !isMainDomain(getSubdomainFromUrl())) {
        return;
      }
      
      // Proceed only if authenticated and we have organizations
      if (isAuthenticated && !authLoading && !orgLoading && organizations.length > 0) {
        console.log('Authenticated user on main domain - redirecting to organization subdomain');
        
        // Get first organization for redirection
        const targetOrg = organizations[0];
        if (targetOrg) {
          setHasRedirected(true); // Prevent redirect loop
          console.log(`Redirecting to ${targetOrg.subdomain}.${MAIN_DOMAIN}/dashboard`);
          redirectToOrganization(targetOrg);
        }
      }
    };

    // Only run this check after auth and org data are loaded
    if (!authLoading && !orgLoading && orgInitialized) {
      redirectAuthenticatedUserToSubdomain();
    }
  }, [
    isAuthenticated, 
    authLoading, 
    orgLoading, 
    organizations, 
    orgInitialized, 
    location.pathname,
    hasRedirected
  ]);

  useEffect(() => {
    // Early exit for main domain optimization
    // This ensures immediate rendering on the main domain
    if (window.__MAIN_DOMAIN_DETECTED && location.pathname === '/') {
      console.log('Main domain fast path detected - bypassing all tenant checks');
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
        // Always render the index page immediately
        if (location.pathname === '/' && !isAuthenticated) {
          console.log('Root path detected for unauthenticated user - bypassing tenant checks');
          setIsChecking(false);
          return;
        }
        
        // Check if this is the main index page or another public page
        const isIndexPage = initializeIndexPageOrganization();
        if (isIndexPage && !isAuthenticated) {
          console.log('Index page detected for unauthenticated user - bypassing tenant checks');
          setIsChecking(false);
          return;
        }
        
        if (authLoading || orgLoading) {
          console.log("Still loading auth or organizations...");
          return;
        }

        // Increment check attempts to implement retry mechanism
        setCheckAttempts(prev => prev + 1);

        const subdomain = getSubdomainFromUrl();
        const hostname = window.location.hostname;
        
        console.log(`TenantRedirector checking - hostname: "${hostname}", subdomain: "${subdomain || 'none'}", attempt: ${checkAttempts + 1}`);
        
        // Determine if we're on the main domain or a development environment
        const isOnMainDomain = isMainDomain(subdomain);
        const isAuthPath = location.pathname === '/login' || location.pathname === '/signup';
        const isPublicPath = location.pathname === '/' || isAuthPath;
        const isDevelopmentDomain = hostname.includes('localhost') || 
                                    hostname.includes('127.0.0.1') || 
                                    hostname.includes('lovableproject.com') ||
                                    hostname.includes('netlify.app') || 
                                    hostname.includes('vercel.app');
        
        console.log('TenantRedirector check details:', { 
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
          console.log("Public path detected, allowing access");
          setIsChecking(false);
          return;
        }
        
        // Handling for main domain or development environment
        if (isOnMainDomain || isDevelopmentDomain || hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
          console.log("Main domain or development URL detected, allowing access");
          
          // Redirect authenticated users from auth pages to organizations
          if (isAuthenticated && isAuthPath) {
            console.log("Redirecting authenticated user from auth page to organizations");
            navigate('/organizations');
            return;
          }
          
          // Redirect users with no organizations to onboarding
          else if (isAuthenticated && organizations.length === 0 && 
                  location.pathname !== '/onboarding' && 
                  location.pathname !== '/create-organization') {
            console.log("Redirecting user with no organizations to onboarding");
            navigate('/onboarding');
            return;
          }
          
          // Redirect authenticated users on main domain to their subdomain dashboard
          // But only if not already on a protected path
          else if (isAuthenticated && organizations.length > 0 && 
                  isOnMainDomain && 
                  location.pathname !== '/organizations' && 
                  location.pathname !== '/create-organization' &&
                  !hasRedirected) {
            const targetOrg = organizations[0];
            if (targetOrg) {
              console.log(`Redirecting authenticated user to subdomain: ${targetOrg.subdomain}`);
              setHasRedirected(true);
              redirectToOrganization(targetOrg);
              return;
            }
          }
        } 
        // Handling for tenant subdomains
        else if (subdomain) {
          console.log(`Tenant subdomain detected: ${subdomain}`);
          
          // Redirect unauthenticated users on protected pages to login
          if (!isAuthenticated && !isPublicPath) {
            console.log("Redirecting unauthenticated user to login");
            navigate('/login');
            return;
          } 
          
          // Show message for authenticated users without access to this organization
          else if (isAuthenticated && !currentOrganization && !orgLoading && !isPublicPath) {
            if (organizations.length > 0 && !hasShownMessage) {
              console.log('User has organizations but no access to this subdomain:', subdomain);
              toast.error('You do not have access to this organization');
              setHasShownMessage(true);
            } else {
              console.log(`Invalid tenant or no access for subdomain: ${subdomain}`);
            }
          }
        }

        // Retry fetching organizations if authenticated and none loaded
        if (isAuthenticated && organizations.length === 0 && !orgLoading) {
          console.log("Attempting to fetch organizations again");
          try {
            await fetchOrganizations();
          } catch (error) {
            console.error('Failed to fetch organizations:', error);
          }
        }
      } catch (error) {
        console.error('Error in TenantRedirector:', error);
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
                       location.pathname === '/login' || 
                       location.pathname === '/signup';
                       
  // Fast path for main domain - show content immediately
  if (window.__MAIN_DOMAIN_DETECTED && location.pathname === '/') {
    console.log("Main domain fast path - rendering children immediately");
    return <>{children}</>;
  }
                       
  if (isChecking && !isPublicPage && checkAttempts < 3 && !orgInitialized) {
    console.log(`Showing loading spinner while checking tenant... (attempt ${checkAttempts + 1})`);
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  console.log("TenantRedirector - Rendering children");
  return <>{children}</>;
};
