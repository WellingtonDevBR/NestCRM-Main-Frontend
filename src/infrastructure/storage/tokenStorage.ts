
import { TenantInfo, AuthToken } from "@/domain/auth/types";

/**
 * Service for handling token and tenant storage
 */
export class TokenStorage {
  private readonly tokenKey = 'auth_token';
  private readonly tenantKey = 'tenant_info';

  /**
   * Save authentication data to local storage
   */
  saveAuthData(token: string, tenant: TenantInfo): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tenantKey, JSON.stringify(tenant));
  }

  /**
   * Clear authentication data from local storage
   */
  clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tenantKey);
  }

  /**
   * Get the current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Get the current tenant information
   */
  getTenant(): TenantInfo | null {
    const tenantInfo = localStorage.getItem(this.tenantKey);
    return tenantInfo ? JSON.parse(tenantInfo) : null;
  }

  /**
   * Check if a user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create a singleton instance
export const tokenStorage = new TokenStorage();
