
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { tenantService } from '@/domain/tenant/tenantService';

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
    // Add back the redirectToTenantDomain method
    redirectToTenantDomain: tenantService?.redirectToTenantDomain?.bind(tenantService) || 
      ((tenant) => {
        console.error('redirectToTenantDomain method not available');
        return Promise.resolve();
      }),
  };
  
  return {
    ...context,
    ...safeAuthService
  };
}
