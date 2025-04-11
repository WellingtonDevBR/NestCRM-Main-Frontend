
import { useState } from "react";

interface UseTenantStatusPollingReturn {
  pollTenantStatus: (domain: string) => Promise<boolean>;
}

export const useTenantStatusPolling = (): UseTenantStatusPollingReturn => {
  // Poll for tenant status after signup with improved reliability
  const pollTenantStatus = async (domain: string): Promise<boolean> => {
    const maxRetries = 20; // Increased for better reliability
    let retries = 0;
    
    const checkStatus = async () => {
      console.log(`Polling tenant status: attempt ${retries + 1} for domain ${domain}`);
      try {
        // Try to fetch the tenant status
        const response = await fetch(`https://${domain}/api/status`, {
          method: 'GET',
          mode: 'no-cors',
          credentials: 'include'
        });
        
        console.log("Tenant appears to be ready");
        return true;
      } catch (error) {
        console.log("Tenant not yet ready, will retry");
        return false;
      }
    };
    
    // Initial check with delay to give server time to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    let isReady = await checkStatus();
    
    while (!isReady && retries < maxRetries) {
      retries++;
      // Exponential backoff for more efficient polling
      const delay = Math.min(2000 + (retries * 1000), 10000);
      console.log(`Waiting ${delay}ms before next check`);
      await new Promise(resolve => setTimeout(resolve, delay));
      isReady = await checkStatus();
    }
    
    return isReady;
  };

  return {
    pollTenantStatus
  };
};
