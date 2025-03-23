
import { useContext } from 'react';
import { AuthContext, AuthProvider as ContextAuthProvider } from '@/contexts/AuthContext';
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
  
  // Safely bind authService methods or provide fallbacks
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
      (() => {
        console.error('redirectToTenantDomain method not available');
      }),
    getCurrentTenant: authService?.getCurrentTenant?.bind(authService) || 
      (() => {
        console.error('getCurrentTenant method not available');
        return null;
      })
  };
  
  return {
    ...context,
    ...safeAuthService
  };
}

// Re-export the provider for convenience
export const AuthProvider = ContextAuthProvider;
