
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign in');
    }

    return await response.json();
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
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sign up');
    }

    return await response.json();
  }
}

// Create a singleton instance
export const authApi = new AuthApi();
