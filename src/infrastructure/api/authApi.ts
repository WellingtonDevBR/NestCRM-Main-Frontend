
import { LoginCredentials, SignUpData, AuthenticatedSession } from "@/domain/auth/types";

/**
 * API client for authentication endpoints
 */
export class AuthApi {
  private readonly baseUrl: string = "https://nestcrm.com.au/api/tenants";

  /**
   * Makes an API request to the tenant login endpoint
   */
  async login(credentials: LoginCredentials): Promise<AuthenticatedSession> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // This is crucial for cookies to be sent and received
      });

      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to sign in (${response.status})`);
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }
      }

      // Try to parse JSON response
      try {
        const responseData = await response.json();
        console.log('Login API response:', responseData);
        
        // Return the tenant information from the response
        return {
          tenant: responseData.tenant,
          message: responseData.message
        };
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Login API error:', error);
      // Re-throw to be handled by service layer
      throw error;
    }
  }

  /**
   * Makes an API request to the tenant signup endpoint
   */
  async signup(data: SignUpData): Promise<AuthenticatedSession> {
    try {
      // Construct the domain from the subdomain
      const domain = `${data.subdomain}.nestcrm.com.au`;
      
      // Format the data correctly according to the required structure
      const signupPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        companyName: data.companyName,
        email: data.email,
        subdomain: data.subdomain,
        domain: domain,
        password: data.password
      };
      
      console.log('Signup payload:', signupPayload);
      
      const response = await fetch(`${this.baseUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupPayload),
        credentials: 'include', // This is crucial for cookies to be sent and received
      });

      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to sign up (${response.status})`);
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText);
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }
      }

      // Try to parse JSON response
      try {
        const responseData = await response.json();
        console.log('Signup API response:', responseData);
        
        // Return the tenant information from the response
        return {
          tenant: responseData.tenant,
          message: responseData.message
        };
      } catch (parseError) {
        console.error('Error parsing JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Signup API error:', error);
      // Re-throw to be handled by service layer
      throw error;
    }
  }
}

// Create a singleton instance
export const authApi = new AuthApi();
