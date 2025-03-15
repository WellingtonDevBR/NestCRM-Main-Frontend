import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { MAIN_DOMAIN } from '@/utils/domainUtils';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string, targetTenant?: string | null): Promise<void> => {
  try {
    console.log('🔑 Authentication: Starting sign in process for:', email);
    
    // Configure auth to use cookies rather than localStorage
    // This is critical for cross-domain authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    console.log('🔑 Authentication: Successfully signed in with email');
    toast.success('Signed in successfully!');

    // Get current user ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.error('🔑 Authentication: Error getting user after login:', userError);
      throw new Error('Unable to get user details');
    }
    
    const userId = user.id;
    console.log('🔍 Organizations: Fetching organizations for user ID:', userId);
    
    // Fetch user's organizations
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', userId);

    if (membershipError) {
      console.error('🔍 Organizations: Error fetching user organization memberships:', membershipError);
      throw new Error('Failed to fetch your organizations');
    }

    console.log('🔍 Organizations: Memberships found:', memberships?.length || 0, memberships);

    // If user has organizations, redirect to the appropriate one
    if (memberships && memberships.length > 0) {
      let targetOrgId = memberships[0].organization_id;
      let targetSubdomain = targetTenant;
      
      // If we have a specific target tenant specified, find matching organization
      if (targetTenant) {
        console.log('🔍 Login: Looking for organization with subdomain:', targetTenant);
        
        // Query for specific organization by subdomain
        const { data: specificOrg, error: specificOrgError } = await supabase
          .from('organizations')
          .select('*')
          .eq('subdomain', targetTenant)
          .maybeSingle();
          
        if (specificOrgError) {
          console.error('🔍 Organizations: Error fetching target organization:', specificOrgError);
        } else if (specificOrg) {
          // Check if the user is a member of this target organization
          const isMember = memberships.some(m => m.organization_id === specificOrg.id);
          
          if (isMember) {
            console.log('🔍 Organizations: User is a member of target organization:', specificOrg.name);
            targetOrgId = specificOrg.id;
            targetSubdomain = specificOrg.subdomain;
          } else {
            console.log('🔍 Organizations: User is NOT a member of target organization');
            toast.warning("You don't have access to that organization");
            // Continue with their first organization instead
          }
        }
      }
      
      // Now get details for the target organization
      const { data: orgData, error: orgDetailsError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', targetOrgId)
        .maybeSingle();

      if (orgDetailsError) {
        console.error('🔍 Organizations: Error fetching organization details:', orgDetailsError);
        throw new Error('Failed to fetch organization details');
      }

      if (orgData) {
        console.log('🔍 Organizations: Organization details retrieved:', orgData.name, 'with subdomain:', orgData.subdomain);
        
        // Create a properly typed Organization object
        const org: Organization = {
          id: orgData.id,
          name: orgData.name,
          subdomain: orgData.subdomain,
          created_at: orgData.created_at,
          updated_at: orgData.updated_at,
          settings: orgData.settings ? 
            (typeof orgData.settings === 'string' 
              ? JSON.parse(orgData.settings) 
              : orgData.settings as Record<string, any>
            ) : {}
        };
        
        console.log('🚀 Redirection: Redirecting to organization subdomain:', org.subdomain);
        
        // Force a direct redirect to the organization subdomain using proper auth transfer
        await redirectToOrganizationSubdomain(org);
        return;
      }
    } else {
      // User has no organizations, redirect to onboarding
      console.log('🚀 Redirection: No organizations found, redirecting to onboarding');
      window.location.href = '/onboarding';
      return;
    }
  } catch (error: any) {
    console.error('❌ Error: Error during sign in:', error);
    toast.error('Error signing in', {
      description: error.message,
    });
    throw error;
  }
};

/**
 * Signs up a new user with email, password, and additional user data
 */
export const signUp = async (email: string, password: string, userData: any): Promise<void> => {
  try {
    console.log('🔑 Authentication: Starting sign up process for:', email);
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;

    console.log('🔑 Authentication: Successfully created account, verification email sent');
    toast.success('Account created successfully!', {
      description: 'Please check your email to verify your account.',
    });
  } catch (error: any) {
    console.error('❌ Error: Error creating account:', error);
    toast.error('Error creating account', {
      description: error.message,
    });
    throw error;
  }
};

/**
 * Signs out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    console.log('🔑 Authentication: Starting sign out process');
    
    // CRITICAL FIX: Clear all storage to prevent persistent sessions
    window.localStorage.removeItem('supabase.auth.token');
    window.sessionStorage.removeItem('supabase.auth.token');
    
    // Clear localStorage and sessionStorage completely
    window.localStorage.clear();
    window.sessionStorage.clear();
    
    // Clear all cookies
    document.cookie.split(";").forEach(function(c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/;domain=." + MAIN_DOMAIN);
    });
    
    const { error } = await supabase.auth.signOut({
      scope: 'global' // Sign out from all tabs/windows
    });
    
    if (error) throw error;
    
    console.log('🔑 Authentication: Successfully signed out, redirecting to main domain');
    
    // CRITICAL FIX: Add a force reload to clear any cached state or redux storage
    setTimeout(() => {
      // Force a complete page reload to clear all JS state
      window.location.href = `${window.location.protocol}//${MAIN_DOMAIN}`;
    }, 500); 
  } catch (error: any) {
    console.error('❌ Error: Error signing out:', error);
    toast.error('Error signing out', {
      description: error.message,
    });
    
    // Force redirect to main domain even if there was an error
    setTimeout(() => {
      // Force a complete page reload to clear all JS state
      window.location.href = `${window.location.protocol}//${MAIN_DOMAIN}`;
    }, 2000);
  }
};

/**
 * Redirects to organization subdomain with proper cross-domain auth handling
 */
export const redirectToOrganizationSubdomain = async (org: Organization): Promise<void> => {
  try {
    // Get the current session for subdomain transfer
    const { data: sessionData } = await supabase.auth.getSession();
    const currentSession = sessionData?.session;
    
    if (!currentSession) {
      console.error('🔑 Authentication: No valid session found for cross-domain redirect');
      toast.error('Authentication error', { 
        description: 'Could not establish a valid session for the subdomain' 
      });
      return;
    }
    
    // Prepare subdomain URL
    const protocol = window.location.protocol;
    const targetSubdomain = `${org.subdomain}.${MAIN_DOMAIN}`;
    const targetPath = '/dashboard';
    const targetUrl = `${protocol}//${targetSubdomain}${targetPath}`;
    
    console.log('🚀 Cross-domain auth: Preparing redirect to:', targetUrl);
    
    try {
      // Explicitly set session to refresh cookie
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });
      
      if (sessionError) {
        console.error('❌ Error setting session:', sessionError);
      }
      
      // Set cookies with max age and matching domain properties
      const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
      const secure = window.location.protocol === 'https:';
      const rootDomain = MAIN_DOMAIN;
      
      // Set cookies at root domain level to allow subdomain access
      document.cookie = `sb-auth-token=${currentSession.access_token}; max-age=${maxAge}; path=/; domain=.${rootDomain}; ${secure ? 'secure;' : ''} SameSite=Lax`;
      document.cookie = `sb-refresh-token=${currentSession.refresh_token}; max-age=${maxAge}; path=/; domain=.${rootDomain}; ${secure ? 'secure;' : ''} SameSite=Lax`;
      document.cookie = `sb-last-auth=${Date.now()}; max-age=${maxAge}; path=/; domain=.${rootDomain}; ${secure ? 'secure;' : ''} SameSite=Lax`;
      
      console.log('🔑 Cross-domain auth: Set auth cookies at domain level:', rootDomain);
      
      // Add a small delay to ensure cookies are properly set
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Explicit ping check to the subdomain (fetch with no-cors)
      try {
        const pingEndpoint = `${protocol}//${targetSubdomain}/ping.txt`;
        console.log('Pinging subdomain to check availability:', pingEndpoint);
        
        const pingResponse = await fetch(pingEndpoint, {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-cache',
        });
        
        console.log('Subdomain ping successful, domain is available');
      } catch (pingError) {
        console.warn('Subdomain ping failed, may not be available:', pingError);
        toast.warning('Subdomain may not be available yet', {
          description: 'Redirecting to organizations page instead'
        });
        window.location.href = '/organizations';
        return;
      }
      
      // Now attempt to refresh the session once more for good measure
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.warn('Failed to refresh session before redirect, but proceeding anyway:', refreshError);
      } else {
        console.log('Successfully refreshed session before redirect');
      }
      
      // Add auth_redirect parameter to signal the target domain
      const finalUrl = `${targetUrl}?auth_redirect=true&org_id=${org.id}`;
      console.log('🚀 Cross-domain auth: Redirecting to:', finalUrl);
      
      // Use a small delay to ensure the browser has processed all our cookie operations
      setTimeout(() => {
        window.location.href = finalUrl;
      }, 200);
    } catch (error) {
      console.error('❌ Error setting cross-domain session:', error);
      toast.error('Authentication error', {
        description: 'Could not set up cross-domain authentication'
      });
      
      // Fallback to organizations page
      window.location.href = '/organizations';
    }
  } catch (error) {
    console.error('❌ Error during organization subdomain redirect:', error);
    toast.error('Redirect error', {
      description: 'Unable to redirect to organization dashboard'
    });
    
    // Fallback to the organizations page
    window.location.href = '/organizations';
  }
};
