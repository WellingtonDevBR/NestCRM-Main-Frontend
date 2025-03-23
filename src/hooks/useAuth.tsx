
import { useContext } from 'react';
import { AuthContext, AuthProvider as ContextAuthProvider } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

export function useAuth() {
  const context = useContext(AuthContext);
  
  // Add more detailed error message for debugging
  if (context === undefined) {
    console.error('useAuth hook was called outside of the AuthProvider context');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    redirectToTenantDomain: authService.redirectToTenantDomain.bind(authService),
    getCurrentTenant: authService.getCurrentTenant.bind(authService)
  };
}

// Re-export the provider for convenience
export const AuthProvider = ContextAuthProvider;
