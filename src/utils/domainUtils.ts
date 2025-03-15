
/**
 * Utilities for handling domain and subdomain logic
 */

/**
 * Extracts the subdomain from the current URL
 * @returns The subdomain string or null if on the main domain
 */
export const getSubdomainFromUrl = (): string | null => {
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For localhost development, check URL format
    const urlSearchParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlSearchParams.get('subdomain');
    if (subdomainParam) {
      return subdomainParam;
    }
    
    // Alternative: check for subdomain.localhost pattern
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      return parts[0];
    }
    return null;
  }
  
  // Handle Netlify/Vercel preview URLs
  if (hostname.includes('preview--')) {
    const parts = hostname.split('--');
    if (parts.length > 1) {
      return parts[1].split('.')[0];
    }
  }
  
  // Production subdomain handling
  // For domain.nestcrm.com.au, extract "domain" as the subdomain
  if (hostname.endsWith('nestcrm.com.au') && hostname !== 'nestcrm.com.au' && hostname !== 'www.nestcrm.com.au') {
    const parts = hostname.split('.');
    // If hostname is subdomain.nestcrm.com.au
    if (parts.length === 4) {
      return parts[0];
    }
  }
  
  return null;
};

/**
 * Checks if a given subdomain is valid
 * @param subdomain The subdomain to validate
 * @returns A regex test result
 */
export const isValidSubdomainFormat = (subdomain: string): boolean => {
  // Check subdomain format
  const subdomainRegex = /^[a-z0-9-]+$/;
  return subdomainRegex.test(subdomain) && subdomain.length >= 3;
};

/**
 * Determines if the current domain is the main/root domain
 * @param subdomain The current subdomain
 * @returns Boolean indicating if this is the main domain
 */
export const isMainDomain = (subdomain: string | null): boolean => {
  return !subdomain || subdomain === 'nestcrm' || subdomain === 'www';
};

/**
 * Builds the full URL for redirecting to a subdomain
 * @param subdomain The subdomain to redirect to
 * @param path The path to include in the URL
 * @returns The complete URL for redirection
 */
export const buildSubdomainUrl = (subdomain: string, path: string = '/dashboard'): string => {
  const protocol = window.location.protocol;
  const host = window.location.host;
  
  // If on localhost, just return a query param version
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return `${path}?subdomain=${subdomain}`;
  }
  
  // In production, generate subdomain URL
  const domainParts = host.split('.');
  
  // If we're on nestcrm.com.au or www.nestcrm.com.au, navigate to subdomain.nestcrm.com.au
  if (domainParts.length >= 2) {
    const baseDomain = domainParts.length > 2 ? domainParts.slice(1).join('.') : domainParts.join('.');
    return `${protocol}//${subdomain}.${baseDomain}${path}`;
  }
  
  // Fallback
  return path;
};
