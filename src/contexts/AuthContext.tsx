
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

  useEffect(() => {
    // Check for existing auth token
    const authState = authService.isAuthenticated();
    if (authState) {
      const tenantInfo = authService.getCurrentTenant();
      setTenant(tenantInfo);
    }
    setLoading(false);

    // Listen for storage events to sync auth state across tabs
    const handleStorageChange = () => {
      const authState = authService.isAuthenticated();
      const tenantInfo = authService.getCurrentTenant();
      setTenant(authState ? tenantInfo : null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    isAuthenticated: authService.isAuthenticated(),
    tenant,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
