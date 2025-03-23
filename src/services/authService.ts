
import { toast } from "sonner";

export interface TenantInfo {
  company: string;
  subdomain: string;
  domain: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  tenant: TenantInfo;
}

export interface SignUpResponse {
  message: string;
  token: string;
  instanceId: string;
  tenant: TenantInfo;
}

/**
 * Sign in a user with their email and password
 */
export const signIn = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch('nestcrm.com.au/api/tenants/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in');
    }

    const data = await response.json();
    
    // Store the auth token in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('tenant_info', JSON.stringify(data.tenant));
    
    return data;
  } catch (error: any) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign up a new user/tenant
 */
export const signUp = async (
  email: string, 
  password: string, 
  userData: { 
    first_name?: string; 
    last_name?: string;
    company: string;
    subdomain: string;
  }
): Promise<SignUpResponse> => {
  try {
    const response = await fetch('nestcrm.com.au/api/tenants/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        ...userData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up');
    }

    const data = await response.json();
    
    // Store the auth token in localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('tenant_info', JSON.stringify(data.tenant));
    
    return data;
  } catch (error: any) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    // Clear the auth token and tenant info from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('tenant_info');
    
    toast.success("Logged out successfully");
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Get the current tenant information
 */
export const getCurrentTenant = (): TenantInfo | null => {
  const tenantInfo = localStorage.getItem('tenant_info');
  return tenantInfo ? JSON.parse(tenantInfo) : null;
};

/**
 * Redirect to tenant subdomain with token
 */
export const redirectToTenantDomain = (tenant: TenantInfo, token: string): void => {
  // Redirect to the tenant domain with the token
  window.location.href = `${tenant.domain}?token=${token}`;
};
