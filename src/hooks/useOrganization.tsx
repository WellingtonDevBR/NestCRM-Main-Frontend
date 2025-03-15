
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Organization } from '@/types/supabase';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  createOrganization: (name: string, subdomain: string) => Promise<Organization | null>;
  switchOrganization: (organizationId: string) => Promise<void>;
  updateOrganization: (id: string, updates: Partial<Organization>) => Promise<void>;
  fetchOrganizations: () => Promise<void>;
  getSubdomainFromUrl: () => string | null;
  isValidSubdomain: (subdomain: string) => Promise<boolean>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Get subdomain from URL
  const getSubdomainFromUrl = (): string | null => {
    const hostname = window.location.hostname;
    
    // For localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Check if using a subdomain like test.localhost:8080
      const parts = hostname.split('.');
      if (parts.length > 1 && parts[0] !== 'www') {
        return parts[0];
      }
      return null;
    }
    
    // For production
    const hostnameSegments = hostname.split('.');
    
    // If we have enough segments for a subdomain (e.g., tenant.example.com)
    if (hostnameSegments.length > 2) {
      return hostnameSegments[0];
    }
    
    return null;
  };

  const fetchOrganizationBySubdomain = async (subdomain: string): Promise<Organization | null> => {
    try {
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

  const fetchOrganizations = async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First, get all organization IDs the user is a member of
      const { data: memberData, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;
      
      if (!memberData || memberData.length === 0) {
        setOrganizations([]);
        setCurrentOrganization(null);
        setLoading(false);
        return;
      }

      // Then fetch the details of these organizations
      const organizationIds = memberData.map(member => member.organization_id);
      
      const { data: organizationsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', organizationIds);

      if (orgsError) throw orgsError;
      
      setOrganizations(organizationsData as Organization[]);
      
      // Check for subdomain to set current organization
      const subdomain = getSubdomainFromUrl();
      if (subdomain) {
        const subdomainOrg = organizationsData.find(org => org.subdomain === subdomain);
        if (subdomainOrg) {
          setCurrentOrganization(subdomainOrg as Organization);
        } else if (organizationsData.length > 0) {
          setCurrentOrganization(organizationsData[0] as Organization);
        }
      } else if (organizationsData.length > 0) {
        setCurrentOrganization(organizationsData[0] as Organization);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  // Check if a subdomain is available
  const isValidSubdomain = async (subdomain: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('subdomain')
        .eq('subdomain', subdomain);

      if (error) throw error;
      return data.length === 0; // Subdomain is valid if no org is using it
    } catch (error) {
      console.error('Error checking subdomain:', error);
      return false;
    }
  };

  const createOrganization = async (name: string, subdomain: string): Promise<Organization | null> => {
    if (!user) {
      toast.error('You must be logged in to create an organization');
      return null;
    }

    try {
      // Check if subdomain is valid (only lowercase letters, numbers, and hyphens)
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(subdomain)) {
        toast.error('Subdomain can only contain lowercase letters, numbers, and hyphens');
        return null;
      }

      // Check if subdomain is available
      const isAvailable = await isValidSubdomain(subdomain);
      if (!isAvailable) {
        toast.error('This subdomain is already taken');
        return null;
      }

      // Insert the new organization
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert([{ name, subdomain }])
        .select()
        .single();

      if (orgError) throw orgError;

      // Add the current user as an owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert([{
          organization_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      const newOrg = orgData as Organization;
      
      // Update local state
      setOrganizations(prev => [...prev, newOrg]);
      setCurrentOrganization(newOrg);
      
      toast.success('Organization created successfully');
      return newOrg;
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error('Failed to create organization', {
        description: error.message
      });
      return null;
    }
  };

  const switchOrganization = async (organizationId: string): Promise<void> => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      toast.success(`Switched to ${org.name}`);
      
      // In a real-world application, we would redirect to the tenant's subdomain
      // For now, we'll just update the context
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setOrganizations(prev => 
        prev.map(org => org.id === id ? { ...org, ...updates } : org)
      );
      
      if (currentOrganization?.id === id) {
        setCurrentOrganization(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Organization updated successfully');
    } catch (error: any) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization', {
        description: error.message
      });
    }
  };

  // Effect to fetch organizations when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrganizations();
    } else {
      // If not authenticated, check if viewing a specific tenant by subdomain
      const subdomain = getSubdomainFromUrl();
      if (subdomain) {
        (async () => {
          const org = await fetchOrganizationBySubdomain(subdomain);
          setCurrentOrganization(org);
          setLoading(false);
        })();
      } else {
        setOrganizations([]);
        setCurrentOrganization(null);
        setLoading(false);
      }
    }
  }, [isAuthenticated, user?.id]);

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        loading,
        createOrganization,
        switchOrganization,
        updateOrganization,
        fetchOrganizations,
        getSubdomainFromUrl,
        isValidSubdomain
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
