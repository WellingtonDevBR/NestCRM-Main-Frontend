
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
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include', // This is crucial for cookies to be sent and received
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in');
    }

    const responseData = await response.json();
    
    console.log('Login API response:', responseData);
    
    // Return the tenant information from the response
    return {
      tenant: responseData.tenant,
      message: responseData.message
    };
  }

  /**
   * Makes an API request to the tenant signup endpoint
   */
  async signup(data: SignUpData): Promise<AuthenticatedSession> {
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up');
    }

    const responseData = await response.json();
    console.log('Signup API response:', responseData);
    
    // Return the tenant information from the response
    return {
      tenant: responseData.tenant,
      message: responseData.message
    };
  }
}

// Create a singleton instance
export const authApi = new AuthApi();
