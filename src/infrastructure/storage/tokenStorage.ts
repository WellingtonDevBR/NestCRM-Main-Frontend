
import { TenantInfo } from "@/domain/auth/types";

/**
 * Service for handling tenant storage
 */
export class TokenStorage {
  private readonly tenantKey = 'tenant_info';

  /**
   * Save tenant information to local storage
   */
  saveTenantInfo(tenant: TenantInfo): void {
    localStorage.setItem(this.tenantKey, JSON.stringify(tenant));
  }

  /**
   * Clear authentication data from local storage
   */
  clearAuthData(): void {
    localStorage.removeItem(this.tenantKey);
    // Note: To clear cookies, a backend endpoint would be needed
    // as frontend JavaScript can't clear HttpOnly cookies
  }

  /**
   * Get the current tenant information
   */
  getTenant(): TenantInfo | null {
    const tenantInfo = localStorage.getItem(this.tenantKey);
    return tenantInfo ? JSON.parse(tenantInfo) : null;
  }

  /**
   * Check if tenant information exists
   */
  hasTenantInfo(): boolean {
    return !!localStorage.getItem(this.tenantKey);
  }
}

// Create a singleton instance
export const tokenStorage = new TokenStorage();
