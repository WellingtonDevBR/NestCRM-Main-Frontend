
import { createContext, useEffect, useState } from 'react';
import { authService, TenantInfo } from '@/services/authService';

type AuthContextType = {
  isAuthenticated: boolean;
  tenant: TenantInfo | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Add debugging log
  console.log('AuthProvider initialized');
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First quickly check the basic auth verification
        // This checks localStorage and cookie flag but doesn't make API calls
        const quickVerification = authService.verifyAuthentication();
        
        if (quickVerification) {
          const tenantInfo = authService.getCurrentTenant();
          setTenant(tenantInfo);
          setIsAuthenticated(true);
          
          // Then asynchronously validate the cookie with an API call
          // This ensures the cookie is still valid server-side
          authService.validateAuthCookie().then(isValid => {
            if (!isValid) {
              // Update state if validation failed
              setIsAuthenticated(false);
              setTenant(null);
            }
          }).catch(error => {
            console.error('Error validating auth cookie:', error);
          });
        } else {
          // Ensure tenant is cleared if verification fails
          setTenant(null);
          setIsAuthenticated(false);
        }
        
        setLoading(false);
        console.log('AuthProvider: auth state loaded', { quickVerification });
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setLoading(false);
      }
    };
    
    initAuth();

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = () => {
      try {
        const authState = authService.verifyAuthentication();
        const tenantInfo = authService.getCurrentTenant();
        setTenant(authState ? tenantInfo : null);
        setIsAuthenticated(authState);
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    isAuthenticated,
    tenant,
    loading,
  };

  // Add debugging log
  console.log('AuthProvider rendering with value:', value);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
