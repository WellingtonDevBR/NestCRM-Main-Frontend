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
 * Service for handling core authentication operations
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
}

// Export a singleton instance
export const authService = new AuthService();
