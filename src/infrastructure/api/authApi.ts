import { LoginCredentials, SignUpData, AuthenticatedSession } from "@/domain/auth/types";

/**
 * API client for authentication endpoints
 */
export class AuthApi {
  private readonly baseUrl: string = "https://nestcrm.com.au/api";

  /**
   * Makes an API request to the tenant login endpoint
   */
  async login(credentials: LoginCredentials): Promise<AuthenticatedSession> {
    try {
      console.log('Login API call - Payload:', JSON.stringify({
        email: credentials.email,
      }));
      
      const response = await fetch(`${this.baseUrl}/tenants/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // This is crucial for cookies to be sent and received
      });
      
      console.log('Login API call - Response status:', response.status);
      console.log('Login API call - Response headers:', 
        [...response.headers.entries()]
          .filter(h => !h[0].toLowerCase().includes('cookie'))
          .map(h => `${h[0]}: ${h[1]}`)
      );

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

        // Ensure we have a tenant domain
        if (!responseData.tenant || !responseData.tenant.domain) {
          console.error('Missing tenant domain in response:', responseData);
          throw new Error('Invalid response: Missing tenant domain');
        }

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
        password: data.password,
        // Include plan ID if available
        planId: data.planId,
        // Include subscription data
        subscription: data.subscription
      };

      console.log('Signup API call - Payload:', JSON.stringify({
        ...signupPayload,
        password: '[REDACTED]', // Redact password in logs
        subscription: data.subscription // Make sure subscription data is logged
      }));

      const response = await fetch(`${this.baseUrl}/tenants/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupPayload),
        credentials: 'include', // Crucial for cookies
      });

      console.log('Signup API call - Response status:', response.status);
      console.log('Signup API call - Response headers:', 
        [...response.headers.entries()]
          .filter(h => !h[0].toLowerCase().includes('cookie'))
          .map(h => `${h[0]}: ${h[1]}`)
      );

      if (!response.ok) {
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Signup API call - Error response:', errorData);
          throw new Error(errorData.message || `Failed to sign up (${response.status})`);
        } else {
          // Handle non-JSON error responses
          const errorText = await response.text();
          console.error('Signup API call - Non-JSON error response:', errorText);
          throw new Error(`Server error (${response.status}). Please try again later.`);
        }
      }

      // Try to parse JSON response
      try {
        const responseData = await response.json();
        console.log('Signup API call - Success response:', responseData);

        // Validate tenant info exists in response
        if (!responseData.tenant || !responseData.tenant.domain) {
          console.error('Signup API call - Missing tenant domain in response:', responseData);
          throw new Error('Invalid response: Missing tenant domain information');
        }

        // Return the tenant information from the response
        return {
          tenant: responseData.tenant,
          message: responseData.message
        };
      } catch (parseError) {
        console.error('Signup API call - Error parsing JSON response:', parseError);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Signup API call - Error:', error);
      // Re-throw to be handled by service layer
      throw error;
    }
  }

  /**
   * Validates if the current authentication cookie is still valid
   * @returns Promise<boolean> True if the cookie is valid, false otherwise
   */
  async validateAuth(): Promise<boolean> {
    try {
      console.log('Validating auth cookie with API call');
      // Attempt a lightweight request to the validation endpoint
      const response = await fetch(`${this.baseUrl}/validate`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('Auth cookie validation - Response status:', response.status);
      
      // Consider 2xx status codes as successful validation
      return response.ok;
    } catch (error) {
      console.error('Error validating authentication:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const authApi = new AuthApi();
