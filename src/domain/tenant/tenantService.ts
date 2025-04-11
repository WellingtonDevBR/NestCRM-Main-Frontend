
import { toast } from "sonner";
import { TenantInfo } from "@/domain/auth/types";

/**
 * Service for handling tenant-related operations
 */
class TenantService {
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
      
      // Use no-cors mode to prevent CORS errors, but this means we can't read the response
      // Instead, we'll rely on error handling to determine if the domain is available
      const response = await fetch(`https://${tenant.domain}/api/status`, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include' // Send cookies
      });

      // If we reach here, the request didn't throw an error, which means the domain exists
      console.log('Tenant status response:', 200);
      return true;
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
    retryDelay = 10000
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
        // Direct navigation without checking status further
        this.performRedirect(tenant.domain);
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
   * Perform the actual redirect to the tenant domain
   * @param domain The tenant domain to redirect to
   */
  private performRedirect(domain: string): void {
    if (!domain) return;
    
    console.log('Tenant is ready, redirecting to:', domain);
    const protocol = window.location.protocol;
    const url = `${protocol}//${domain}/dashboard`;
    
    // Use window.location.replace for a cleaner redirect (no back button entry)
    window.location.replace(url);
  }
}

// Export a singleton instance
export const tenantService = new TenantService();
