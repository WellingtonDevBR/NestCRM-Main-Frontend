
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';

/**
 * Custom hook for authentication functionality
 * Provides access to auth context and methods
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  // Add more detailed error message for debugging
  if (context === undefined) {
    console.error('useAuth hook was called outside of the AuthProvider context');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Make sure authService methods are safely accessed
  const safeAuthService = {
    signIn: authService?.signIn?.bind(authService) || 
      (() => {
        console.error('signIn method not available');
        return Promise.resolve({ success: false, error: { message: 'Authentication service unavailable' } });
      }),
    signUp: authService?.signUp?.bind(authService) || 
      (() => {
        console.error('signUp method not available');
        return Promise.resolve({ success: false, error: { message: 'Authentication service unavailable' } });
      }),
    signOut: authService?.signOut?.bind(authService) || 
      (() => {
        console.error('signOut method not available');
        return Promise.resolve();
      }),
    redirectToTenantDomain: authService?.redirectToTenantDomain?.bind(authService) || 
      ((tenant) => {
        console.error('redirectToTenantDomain method not available');
        // Fallback implementation of redirect if authService is not available
        if (tenant && tenant.domain) {
          console.log('Fallback redirection to tenant domain:', tenant.domain);
          const protocol = window.location.protocol;
          window.location.href = `${protocol}//${tenant.domain}/dashboard`;
        }
      })
  };
  
  return {
    ...context,
    ...safeAuthService
  };
}
