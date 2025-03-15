
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
        
        // Force a direct redirect to the organization subdomain
        redirectToOrganizationSubdomain(org);
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
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    console.log('🔑 Authentication: Successfully signed out, redirecting to main domain');
    
    // Redirect to main domain, not a subdomain
    window.location.href = `${window.location.protocol}//${MAIN_DOMAIN}`;
  } catch (error: any) {
    console.error('❌ Error: Error signing out:', error);
    toast.error('Error signing out', {
      description: error.message,
    });
    
    // Force redirect to main domain even if there was an error
    setTimeout(() => {
      window.location.href = `${window.location.protocol}//${MAIN_DOMAIN}`;
    }, 2000);
  }
};

/**
 * Redirects to organization subdomain
 */
export const redirectToOrganizationSubdomain = (org: Organization): void => {
  // Force a direct redirect to the organization subdomain
  const protocol = window.location.protocol;
  const url = `${protocol}//${org.subdomain}.${MAIN_DOMAIN}/dashboard`;
  
  console.log('🚀 Redirection: Direct redirect URL:', url);
  
  // Use a small timeout to ensure the toast is visible before redirect
  setTimeout(() => {
    console.log('🚀 Redirection: Executing redirect now to:', url);
    window.location.href = url;
  }, 500);
};
