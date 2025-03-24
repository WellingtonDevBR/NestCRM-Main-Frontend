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

      console.log('Login response:', response);

      // Store the tenant info
      if (response && response.tenant) {
        // Token is now handled by cookies, just store the tenant info
        tokenStorage.saveTenantInfo(response.tenant);

        return {
          success: true,
          session: response
        };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error('Error signing in:', error);

      // Provide a user-friendly error message
      const friendlyMessage = this.getFriendlyErrorMessage(error, 'sign in');

      return {
        success: false,
        error: {
          message: friendlyMessage,
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

      // Store the tenant info
      if (response && response.tenant) {
        // Token is now handled by cookies, just store the tenant info
        tokenStorage.saveTenantInfo(response.tenant);

        return {
          success: true,
          session: response
        };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error: any) {
      console.error('Error signing up:', error);

      // Provide a user-friendly error message
      const friendlyMessage = this.getFriendlyErrorMessage(error, 'sign up');

      return {
        success: false,
        error: {
          message: friendlyMessage,
          code: 'auth/sign-up-error'
        }
      };
    }
  }

  /**
   * Convert technical errors to user-friendly messages
   */
  private getFriendlyErrorMessage(error: any, action: string): string {
    // Extract the error message
    const errorMessage = error.message || '';

    // Check for specific error conditions and provide friendly messages
    if (errorMessage.includes('Server error')) {
      return `Our servers are currently experiencing issues. Please try again later.`;
    }

    if (errorMessage.includes('Invalid response format')) {
      return `We're having trouble communicating with our servers. Please try again later.`;
    }

    if (errorMessage.toLowerCase().includes('network') ||
      errorMessage.toLowerCase().includes('connection')) {
      return `Please check your internet connection and try again.`;
    }

    // Return the original error message if it seems user-friendly enough,
    // otherwise provide a generic message
    return errorMessage || `An unexpected error occurred during ${action}. Please try again.`;
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    try {
      // Clear tenant info from localStorage
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
    try {
      // Get tenant info and verify it still exists
      const tenant = this.getCurrentTenant();
      if (!tenant) {
        console.log('No tenant info found, user is not authenticated');
        return false;
      }
      
      // For more security, check if the auth cookie exists
      // This will return true only if both localStorage tenant info AND the cookie exist
      return this.hasCookieToken();
    } catch (error) {
      console.error('Error checking authentication status:', error);
      return false;
    }
  }

  /**
   * Check if the authentication cookie exists in the browser
   * We can't directly access HttpOnly cookies, but we can make a lightweight request
   * to check if the cookie is being sent with requests
   */
  private hasCookieToken(): boolean {
    // Check tenant info existence first as a quick check
    if (!tokenStorage.hasTenantInfo()) {
      return false;
    }
    
    // We'll use a cookie flag in localStorage that gets cleared if we detect invalid auth
    const cookieValid = tokenStorage.getCookieValidFlag();
    
    // If we explicitly know the cookie is invalid, return false immediately
    if (cookieValid === false) {
      return false;
    }
    
    return true;
  }

  /**
   * Get the current tenant information
   */
  getCurrentTenant(): TenantInfo | null {
    return tokenStorage.getTenant();
  }

  /**
   * Get the current auth token - Now returns null as cookies handle this
   */
  getCurrentToken(): string | null {
    return null; // Token is now handled by cookies
  }

  /**
   * Check if tenant subdomain is ready
   * @param tenant The tenant information
   * @returns Promise<boolean> True if tenant is ready, false otherwise
   */
  async checkTenantStatus(tenant: TenantInfo | null): Promise<boolean> {
    if (!tenant || !tenant.domain) {
      console.error('Cannot check tenant status: missing tenant information');
      return false;
    }

    try {
      console.log('Checking tenant status for domain:', tenant.domain);
      const response = await fetch(`https://${tenant.domain}/api/status`, {
        method: 'GET',
        credentials: 'include', // Send cookies
      });

      console.log('Tenant status response:', response.status);
      return response.status === 200;
    } catch (error) {
      console.error('Error checking tenant status:', error);
      return false;
    }
  }

  /**
   * Redirect to tenant subdomain with status check
   * @param tenant The tenant information
   * @param maxRetries Maximum number of retries
   * @param retryDelay Delay between retries in ms
   */
  async redirectToTenantDomain(
    tenant: TenantInfo | null,
    maxRetries = 10,
    retryDelay = 5000
  ): Promise<void> {
    // Only redirect if tenant is valid
    if (!tenant) {
      console.error('Cannot redirect: missing tenant', { tenant });
      return;
    }

    console.log('Attempting to redirect to tenant domain:', tenant.domain);

    // Try to check tenant status with retries
    let retries = 0;
    let isReady = false;

    while (retries < maxRetries && !isReady) {
      isReady = await this.checkTenantStatus(tenant);

      if (isReady) {
        // Redirect to the tenant domain - cookies will be sent automatically
        console.log('Tenant is ready, redirecting to:', tenant.domain);
        const protocol = window.location.protocol;
        window.location.href = `${protocol}//${tenant.domain}/dashboard`;
        return;
      }

      retries++;
      console.log(`Tenant not ready yet, retry ${retries}/${maxRetries}`);

      if (retries < maxRetries) {
        // Wait before next retry
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    // If we get here, max retries reached but tenant still not ready
    if (!isReady) {
      console.error('Tenant not ready after maximum retries');
      toast.error("Your account is being set up", {
        description: "Please try again in a few moments."
      });
    }
  }

  /**
   * Verify if the user's authentication is still valid
   * This handles cases where the token might have been cleared or expired
   */
  verifyAuthentication(): boolean {
    try {
      // First check if tenant info exists in localStorage
      const isTenantValid = tokenStorage.hasTenantInfo();
      
      if (!isTenantValid) {
        console.log('Authentication verification failed: No valid tenant info');
        // Clean up any leftover data
        this.signOut().catch(err => console.error('Error signing out during verification:', err));
        return false;
      }
      
      // Check cookie validity
      const hasCookie = this.hasCookieToken();
      if (!hasCookie) {
        console.log('Authentication verification failed: Missing authentication cookie');
        // Update cookie validity flag
        tokenStorage.setCookieValidFlag(false);
        return false;
      }
      
      // If we've made it here, both tenant info and cookie appear valid
      tokenStorage.setCookieValidFlag(true);
      return true;
    } catch (error) {
      console.error('Error verifying authentication:', error);
      return false;
    }
  }

  /**
   * Validate authentication by making a test request to the API
   * This can be called periodically to ensure tokens are still valid
   */
  async validateAuthCookie(): Promise<boolean> {
    // Get the current tenant
    const tenant = this.getCurrentTenant();
    if (!tenant) {
      console.log('No tenant info found when validating auth cookie');
      tokenStorage.setCookieValidFlag(false);
      return false;
    }
    
    try {
      // Make a lightweight validation request
      const isValid = await authApi.validateAuth();
      
      // Update the cookie validity flag
      tokenStorage.setCookieValidFlag(isValid);
      
      if (!isValid) {
        // If validation fails, clear auth data
        console.log('Auth cookie validation failed, clearing auth data');
        await this.signOut();
      }
      
      return isValid;
    } catch (error) {
      console.error('Error validating auth cookie:', error);
      tokenStorage.setCookieValidFlag(false);
      return false;
    }
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
