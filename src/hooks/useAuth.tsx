
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
        console.log('No user ID found after login');
        navigate('/organizations');
        return;
      }

      console.log('Fetching organizations for user:', userId);
      
      // Fetch user's organizations
      const { data: organizations, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', userId);

      if (orgError) {
        console.error('Error fetching user organizations:', orgError);
        navigate('/organizations');
        return;
      }

      console.log('Organizations found:', organizations?.length || 0);

      // If user has organizations, redirect to the first one
      if (organizations && organizations.length > 0) {
        console.log('User has organizations, redirecting to first one:', organizations[0].organization_id);
        
        const { data: orgData, error: orgDetailsError } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizations[0].organization_id)
          .single();

        if (orgDetailsError) {
          console.error('Error fetching organization details:', orgDetailsError);
          navigate('/organizations');
          return;
        }

        if (orgData) {
          console.log('Organization details retrieved:', orgData.name);
          
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
          redirectToOrganization(org);
          return;
        }
      } else {
        // User has no organizations, redirect to onboarding
        console.log('No organizations found, redirecting to onboarding');
        navigate('/onboarding');
        return;
      }

      navigate('/organizations');
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
