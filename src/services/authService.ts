
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';
import { MAIN_DOMAIN } from '@/utils/domainUtils';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    console.log('🔑 Authentication: Starting sign in process for:', email);
    
    // Configure auth to use cookies rather than localStorage
    // This is critical for cross-domain authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // Enable cookie-based auth for cross-domain support
        cookieSecure: true,
        // Set a relatively long session expiry for testing
        // In production, you might want to adjust this
        expiresIn: 60 * 60 * 24 * 7, // 7 days
      }
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

    // If user has organizations, redirect to the first one
    if (memberships && memberships.length > 0) {
      const organizationId = memberships[0].organization_id;
      console.log('🔍 Organizations: User has organizations, redirecting to first one:', organizationId);
      
      const { data: orgData, error: orgDetailsError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
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
        // Enable cookie-based auth for cross-domain support
        cookieSecure: true,
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
      // Force set the session with proper cookies
      await supabase.auth.setSession({
        access_token: currentSession.access_token,
        refresh_token: currentSession.refresh_token,
      });
      
      // Explicitly set a cookie with the root domain to ensure subdomain access
      // This is a backup in case Supabase isn't setting the cookies correctly
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
      
      // Set a session indicator cookie with the root domain
      document.cookie = `sb-auth=true; expires=${expiryDate.toUTCString()}; path=/; domain=.${MAIN_DOMAIN}; secure`;
      
      // Also set a cookie that indicates this is a cross-domain redirect
      document.cookie = `auth_redirect=true; path=/; domain=.${MAIN_DOMAIN}; secure`;
      
      console.log('🔑 Cross-domain auth: Successfully prepared session for subdomain access');
    } catch (error) {
      console.error('❌ Error setting cross-domain session:', error);
    }
    
    // Add organization ID and access token to the URL as temporary parameters
    // These will be used to restore the session if cookies fail
    const urlWithAuth = `${targetUrl}?auth_redirect=true&org_id=${org.id}`;
    
    // Use a small timeout to ensure the auth state is properly set
    setTimeout(() => {
      console.log('🚀 Cross-domain auth: Executing redirect to subdomain:', urlWithAuth);
      window.location.href = urlWithAuth;
    }, 1000); // Slightly longer timeout to ensure cookies are properly set
  } catch (error) {
    console.error('❌ Error during organization subdomain redirect:', error);
    toast.error('Redirect error', {
      description: 'Unable to redirect to organization dashboard'
    });
  }
};
