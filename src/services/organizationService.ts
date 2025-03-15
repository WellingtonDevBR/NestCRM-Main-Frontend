
import { supabase } from '@/integrations/supabase/client';
import type { Organization } from '@/types/supabase';

// Constants for edge function
const EDGE_FUNCTION_URL = 'https://kfwysiwnacrkncgmkqpa.supabase.co/functions/v1/get-organization';

/**
 * Fetch organization by subdomain using edge function or direct DB query
 */
export const fetchOrganizationBySubdomain = async (subdomain: string): Promise<Organization | null> => {
  try {
    console.log(`Fetching organization by subdomain: ${subdomain}`);
    
    // First try the edge function
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ subdomain })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.organization) {
          console.log('Successfully fetched organization:', result.organization);
          return result.organization as Organization;
        }
      }
      
      console.error(`Edge function error: ${response.status}`);
    } catch (edgeFunctionError) {
      console.error('Edge function failed:', edgeFunctionError);
    }
    
    // Fallback to direct database query if edge function fails
    console.log('Falling back to direct database query');
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('subdomain', subdomain)
      .single();

    if (error) {
      console.error('Error fetching organization by subdomain:', error);
      return null;
    }

    return data as Organization;
  } catch (error) {
    console.error('Error in fetchOrganizationBySubdomain:', error);
    return null;
  }
};

/**
 * Check if a subdomain is available (not already taken)
 */
export const checkSubdomainAvailability = async (subdomain: string): Promise<boolean> => {
  try {
    if (subdomain.length < 3) return false;
    
    // Check subdomain format first
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return false;
    }
    
    const { data, error } = await supabase
      .from('organizations')
      .select('subdomain')
      .eq('subdomain', subdomain);

    if (error) {
      console.error('Error checking subdomain:', error);
      return false;
    }
    
    return data.length === 0; // Subdomain is valid if no org is using it
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return false;
  }
};

/**
 * Fetch organizations for the current user
 */
export const fetchUserOrganizations = async (userId: string): Promise<Organization[]> => {
  try {
    const { data: memberData, error: memberError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', userId);

    if (memberError) {
      console.error('Error fetching organization memberships:', memberError);
      throw memberError;
    }
    
    if (!memberData || memberData.length === 0) {
      return [];
    }

    const organizationIds = memberData.map(member => member.organization_id);
    
    const { data: organizationsData, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .in('id', organizationIds);

    if (orgsError) {
      console.error('Error fetching organizations data:', orgsError);
      throw orgsError;
    }
    
    return organizationsData as Organization[];
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw error;
  }
};

/**
 * Create a new organization and add the user as an owner
 */
export const createNewOrganization = async (
  name: string, 
  subdomain: string, 
  userId: string
): Promise<Organization | null> => {
  try {
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .insert([{ name, subdomain }])
      .select()
      .single();

    if (orgError) throw orgError;

    const { error: memberError } = await supabase
      .from('organization_members')
      .insert([{
        organization_id: orgData.id,
        user_id: userId,
        role: 'owner'
      }]);

    if (memberError) throw memberError;

    return orgData as Organization;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
};

/**
 * Update an organization's details
 */
export const updateOrganizationDetails = async (
  id: string, 
  updates: Partial<Organization>
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('organizations')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating organization:', error);
    throw error;
  }
};
