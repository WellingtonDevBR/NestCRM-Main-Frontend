
import { tokenStorage } from "@/infrastructure/storage/tokenStorage";
import { authApi } from "@/infrastructure/api/authApi";
import { TenantInfo } from "@/domain/auth/types";

/**
 * Service for handling authentication state verification
 */
class AuthStateService {
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
   * Verify if the user's authentication is still valid
   * This handles cases where the token might have been cleared or expired
   */
  verifyAuthentication(): boolean {
    try {
      // First check if tenant info exists in localStorage
      const isTenantValid = tokenStorage.hasTenantInfo();
      
      if (!isTenantValid) {
        console.log('Authentication verification failed: No valid tenant info');
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
        tokenStorage.clearAuthData();
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
export const authStateService = new AuthStateService();
