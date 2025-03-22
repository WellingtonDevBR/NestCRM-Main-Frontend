
/**
 * Utility functions for working with subdomains
 */

/**
 * Gets the current subdomain from the hostname
 * Returns null if on the root domain or localhost
 */
export function getSubdomain(): string | null {
  const hostname = window.location.hostname;
  
  // If we're on localhost, return null or a test subdomain for development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For testing, you can return a mock subdomain or null
    // return 'company123'; // Uncomment to test with a mock subdomain
    return null;
  }
  
  // Split the hostname by dots
  const parts = hostname.split('.');
  
  // If we have enough parts for a subdomain (e.g., company.example.com)
  if (parts.length > 2) {
    return parts[0];
  }
  
  // No subdomain found
  return null;
}

/**
 * Checks if we're on a dashboard subdomain
 */
export function isOnDashboardSubdomain(): boolean {
  return getSubdomain() !== null;
}

/**
 * Redirects to a specific subdomain
 */
export function redirectToSubdomain(subdomain: string): void {
  const { protocol, hostname, port } = window.location;
  
  // Extract the main domain (last two parts of the hostname)
  const hostParts = hostname.split('.');
  const mainDomain = hostParts.length > 2 
    ? hostParts.slice(hostParts.length - 2).join('.')
    : hostname;
  
  // Build the new URL with the subdomain
  let newUrl = `${protocol}//${subdomain}.${mainDomain}`;
  
  // Add port if it exists (for development)
  if (port) {
    newUrl += `:${port}`;
  }
  
  // Add the path (typically '/dashboard')
  newUrl += '/dashboard';
  
  // Redirect
  window.location.href = newUrl;
}

/**
 * Redirects to the main domain from a subdomain
 */
export function redirectToMainDomain(): void {
  const { protocol, hostname, port } = window.location;
  
  // Extract the main domain (last two parts of the hostname)
  const hostParts = hostname.split('.');
  const mainDomain = hostParts.length > 2 
    ? hostParts.slice(hostParts.length - 2).join('.')
    : hostname;
  
  // Build the new URL with the main domain only
  let newUrl = `${protocol}//${mainDomain}`;
  
  // Add port if it exists (for development)
  if (port) {
    newUrl += `:${port}`;
  }
  
  // Redirect to the home page
  window.location.href = newUrl;
}
