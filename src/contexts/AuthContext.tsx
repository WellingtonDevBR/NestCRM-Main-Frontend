
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
    try {
      // Use the verification method to check auth state
      const authState = authService?.verifyAuthentication?.() || false;
      if (authState) {
        const tenantInfo = authService?.getCurrentTenant?.() || null;
        setTenant(tenantInfo);
      } else {
        // Ensure tenant is cleared if verification fails
        setTenant(null);
      }
      setIsAuthenticated(authState);
      setLoading(false);
      
      console.log('AuthProvider: auth state loaded', { authState });
    } catch (error) {
      console.error('Error initializing auth state:', error);
      setLoading(false);
    }

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = () => {
      try {
        // Use verification method for storage events too
        const authState = authService?.verifyAuthentication?.() || false;
        const tenantInfo = authService?.getCurrentTenant?.() || null;
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
