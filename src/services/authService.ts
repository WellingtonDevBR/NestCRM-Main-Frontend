
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    toast.success('Signed in successfully!');

    // Get current user ID
    const userId = (await supabase.auth.getUser()).data.user?.id;

    if (!userId) {
      console.error('No user ID found after login');
      return;
    }

    console.log('Fetching organizations for user:', userId);
    
    // Fetch user's organizations
    const { data: memberships, error: membershipError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId);

    if (membershipError) {
      console.error('Error fetching user organization memberships:', membershipError);
      return;
    }

    console.log('Organization memberships found:', memberships?.length || 0, memberships);

    // If user has organizations, redirect to the first one
    if (memberships && memberships.length > 0) {
      const organizationId = memberships[0].organization_id;
      console.log('User has organizations, redirecting to first one:', organizationId);
      
      const { data: orgData, error: orgDetailsError } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', organizationId)
        .single();

      if (orgDetailsError) {
        console.error('Error fetching organization details:', orgDetailsError);
        return;
      }

      if (orgData) {
        console.log('Organization details retrieved:', orgData.name, 'with subdomain:', orgData.subdomain);
        
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
        
        console.log('Redirecting to organization subdomain:', org.subdomain);
        
        // Force a direct redirect to the organization subdomain
        redirectToOrganizationSubdomain(org);
        return;
      }
    } else {
      // User has no organizations, redirect to onboarding
      console.log('No organizations found, redirecting to onboarding');
      window.location.href = '/onboarding';
      return;
    }
  } catch (error: any) {
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) throw error;

    toast.success('Account created successfully!', {
      description: 'Please check your email to verify your account.',
    });
  } catch (error: any) {
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect to main domain
    window.location.href = `${window.location.protocol}//${window.location.host.split('.').slice(-2).join('.')}`;
  } catch (error: any) {
    toast.error('Error signing out', {
      description: error.message,
    });
  }
};

/**
 * Redirects to organization subdomain
 */
export const redirectToOrganizationSubdomain = (org: Organization): void => {
  // Force a direct redirect to the organization subdomain
  const protocol = window.location.protocol;
  const domain = 'nestcrm.com.au'; // Hardcoded domain to ensure it works in production
  const url = `${protocol}//${org.subdomain}.${domain}/dashboard`;
  
  console.log('Direct redirect URL:', url);
  
  // Use a small timeout to ensure the toast is visible before redirect
  setTimeout(() => {
    window.location.href = url;
  }, 500);
};
