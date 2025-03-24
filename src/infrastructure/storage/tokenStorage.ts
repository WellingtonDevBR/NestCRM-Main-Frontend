
import { TenantInfo } from "@/domain/auth/types";

/**
 * Service for handling tenant storage
 */
export class TokenStorage {
  private readonly tenantKey = 'tenant_info';
  private readonly cookieValidKey = 'auth_cookie_valid';

  /**
   * Save tenant information to local storage
   */
  saveTenantInfo(tenant: TenantInfo): void {
    localStorage.setItem(this.tenantKey, JSON.stringify(tenant));
    // When setting tenant info, initialize cookie as valid
    this.setCookieValidFlag(true);
  }

  /**
   * Clear authentication data from local storage
   */
  clearAuthData(): void {
    localStorage.removeItem(this.tenantKey);
    localStorage.removeItem(this.cookieValidKey);
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

  /**
   * Set the cookie validity flag
   * This helps track whether we believe the auth cookie is still valid
   */
  setCookieValidFlag(isValid: boolean): void {
    localStorage.setItem(this.cookieValidKey, String(isValid));
  }

  /**
   * Get the cookie validity flag
   * Returns undefined if flag hasn't been set yet
   */
  getCookieValidFlag(): boolean | undefined {
    const flag = localStorage.getItem(this.cookieValidKey);
    if (flag === null) return undefined;
    return flag === 'true';
  }
}

// Create a singleton instance
export const tokenStorage = new TokenStorage();
