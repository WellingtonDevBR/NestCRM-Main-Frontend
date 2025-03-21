
import { supabase } from '@/integrations/supabase/client';

/**
 * Sign in a user with their email and password
 */
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Error signing in:', error);
    throw error;
  }

  return data;
};

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string, userData?: { first_name?: string; last_name?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });

  if (error) {
    console.error('Error signing up:', error);
    throw error;
  }

  return data;
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};
