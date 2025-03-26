
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
      
      // Explicitly set the headers with the Host header using the tenant domain
      const headers = new Headers({
        'Host': tenant.domain
      });
      
      const response = await fetch(`https://${tenant.domain}/api/status`, {
        method: 'GET',
        credentials: 'include', // Send cookies
        headers: headers
      });

      console.log('Tenant status response:', response.status);
      return response.status === 200;
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
    retryDelay = 5000
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
        // Redirect to the tenant domain - cookies will be sent automatically
        console.log('Tenant is ready, redirecting to:', tenant.domain);
        const protocol = window.location.protocol;
        window.location.href = `${protocol}//${tenant.domain}/dashboard`;
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
}

// Export a singleton instance
export const tenantService = new TenantService();
