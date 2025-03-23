
import { toast } from "sonner";
import { authApi } from "@/infrastructure/api/authApi";
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";
import { 
  LoginCredentials, 
  SignUpData, 
  AuthResult, 
  TenantInfo, 
  AuthenticatedSession 
} from "@/domain/auth/types";

/**
 * Service for handling authentication
 */
class AuthService {
  /**
   * Sign in a user with their email and password
   */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const credentials: LoginCredentials = { email, password };
      const response = await authApi.login(credentials);
      
      // Store the auth token and tenant info
      if (response && response.token && response.tenant) {
        tokenStorage.saveAuthData(response.token, response.tenant);
        
        return {
          success: true,
          session: response
        };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      return {
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred during sign in',
          code: 'auth/sign-in-error'
        }
      };
    }
  }

  /**
   * Sign up a new user/tenant
   */
  async signUp(signUpData: SignUpData): Promise<AuthResult> {
    try {
      // Log the signup data for debugging
      console.log('Signup data:', signUpData);
      
      const response = await authApi.signup(signUpData);
      
      console.log('Signup response:', response);
      
      // Store the auth token and tenant info
      if (response && response.token && response.tenant) {
        // For signup, token might be a string instead of an object
        const tokenValue = typeof response.token === 'string' 
          ? response.token 
          : response.token.token;
          
        tokenStorage.saveAuthData(tokenValue, response.tenant);
        
        return {
          success: true,
          session: response
        };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error('Error signing up:', error);
      return {
        success: false,
        error: {
          message: error.message || 'An unexpected error occurred during sign up',
          code: 'auth/sign-up-error'
        }
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Clear the auth token and tenant info from localStorage
      tokenStorage.clearAuthData();
      
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error("Failed to log out");
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  }

  /**
   * Get the current tenant information
   */
  getCurrentTenant(): TenantInfo | null {
    return tokenStorage.getTenant();
  }

  /**
   * Redirect to tenant subdomain with token
   */
  redirectToTenantDomain(tenant: TenantInfo | null, token: string | null): void {
    // Only redirect if both tenant and token are valid
    if (!tenant || !token) {
      console.error('Cannot redirect: missing tenant or token');
      return;
    }
    
    // Redirect to the tenant domain with the token as a query parameter
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${tenant.domain}/dashboard?token=${token}`;
  }
}

// Export a singleton instance
export const authService = new AuthService();

// Re-export types for convenience
export type { 
  TenantInfo, 
  LoginCredentials, 
  SignUpData, 
  AuthResult,
  AuthenticatedSession
} from "@/domain/auth/types";
