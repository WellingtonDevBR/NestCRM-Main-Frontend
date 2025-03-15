
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useOrganization } from '@/hooks/useOrganization';
import { redirectToOrganization } from '@/utils/organizationUtils';
import type { Organization } from '@/types/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
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

  const signIn = async (email: string, password: string) => {
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
        navigate('/organizations');
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
        navigate('/organizations');
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
          navigate('/organizations');
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
          const protocol = window.location.protocol;
          const domain = 'nestcrm.com.au'; // Hardcoded domain to ensure it works in production
          const url = `${protocol}//${org.subdomain}.${domain}/dashboard`;
          
          console.log('Direct redirect URL:', url);
          
          // Use a small timeout to ensure the toast is visible before redirect
          setTimeout(() => {
            window.location.href = url;
          }, 500);
          return;
        }
      } else {
        // User has no organizations, redirect to onboarding
        console.log('No organizations found, redirecting to onboarding');
        navigate('/onboarding');
        return;
      }
    } catch (error: any) {
      toast.error('Error signing in', {
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      window.location.href = `${window.location.protocol}//${window.location.host.split('.').slice(-2).join('.')}`;
    } catch (error: any) {
      toast.error('Error signing out', {
        description: error.message,
      });
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
