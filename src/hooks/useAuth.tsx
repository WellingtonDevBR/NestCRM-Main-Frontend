
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { SignUpData } from '@/domain/auth/types';

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return {
    ...context,
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    redirectToTenantDomain: authService.redirectToTenantDomain.bind(authService),
    getCurrentToken: authService.getCurrentToken.bind(authService)
  };
}

// Re-export the provider for convenience
export { AuthProvider } from '@/contexts/AuthContext';
