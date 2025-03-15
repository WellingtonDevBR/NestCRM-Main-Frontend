
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { signIn, signUp, signOut } from '@/services/authService';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    signIn,
    signUp,
    signOut
  };
}

// Re-export the provider for convenience
export { AuthProvider } from '@/contexts/AuthContext';
