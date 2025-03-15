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

  const getSubdomainFromUrl = (): string | null => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const parts = hostname.split('.');
      if (parts.length > 1 && parts[0] !== 'www') {
        return parts[0];
      }
      return null;
    }
    
    if (hostname.includes('preview--')) {
      const parts = hostname.split('--');
      if (parts.length > 1) {
        return parts[1].split('.')[0];
      }
    }
    
    const hostnameSegments = hostname.split('.');
    
    if (hostnameSegments.length > 2) {
      return hostnameSegments[0];
    }
    
    return null;
  };

  const fetchOrganizationBySubdomain = async (subdomain: string): Promise<Organization | null> => {
    try {
      console.log(`Fetching organization by subdomain: ${subdomain}`);
      
      const response = await fetch(`${supabase.supabaseUrl}/functions/v1/get-organization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabase.supabaseKey}`
        },
        body: JSON.stringify({ subdomain })
      });
      
      if (!response.ok) {
        console.error(`Error response from edge function: ${response.status}`);
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
      }
      
      const result = await response.json();
      if (result.error) {
        console.error('Error from edge function:', result.error);
        return null;
      }
      
      console.log('Successfully fetched organization:', result.organization);
      return result.organization as Organization;
    } catch (error) {
      console.error('Error in fetchOrganizationBySubdomain:', error);
      return null;
    }
  };

  const fetchOrganizations = async (): Promise<void> => {
    if (!user) return;

    try {
      setLoading(true);
      
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

      const organizationIds = memberData.map(member => member.organization_id);
      
      const { data: organizationsData, error: orgsError } = await supabase
        .from('organizations')
        .select('*')
        .in('id', organizationIds);

      if (orgsError) throw orgsError;
      
      setOrganizations(organizationsData as Organization[]);
      
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
      const subdomainRegex = /^[a-z0-9-]+$/;
      if (!subdomainRegex.test(subdomain)) {
        toast.error('Subdomain can only contain lowercase letters, numbers, and hyphens');
        return null;
      }

      const isAvailable = await isValidSubdomain(subdomain);
      if (!isAvailable) {
        toast.error('This subdomain is already taken');
        return null;
      }

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
          user_id: user.id,
          role: 'owner'
        }]);

      if (memberError) throw memberError;

      const newOrg = orgData as Organization;
      
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
    }
  };

  const updateOrganization = async (id: string, updates: Partial<Organization>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

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

  useEffect(() => {
    const initializeOrganization = async () => {
      setLoading(true);
      try {
        const subdomain = getSubdomainFromUrl();
        console.log(`Initializing organization with subdomain: ${subdomain || 'none'}`);
        
        if (subdomain) {
          const org = await fetchOrganizationBySubdomain(subdomain);
          setCurrentOrganization(org);
          
          if (isAuthenticated) {
            await fetchOrganizations();
          }
        } else if (isAuthenticated) {
          await fetchOrganizations();
        } else {
          setOrganizations([]);
          setCurrentOrganization(null);
        }
      } catch (error) {
        console.error('Error initializing organization:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeOrganization();
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
