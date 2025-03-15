
/**
 * Utilities for handling domain and subdomain logic
 */

// Main domain constants
const MAIN_DOMAIN = 'nestcrm.com.au';
const MAIN_DOMAIN_IDENTIFIERS = ['nestcrm', 'www'];

/**
 * Extracts the subdomain from the current URL
 * @returns The subdomain string or null if on the main domain
 */
export const getSubdomainFromUrl = (): string | null => {
  const hostname = window.location.hostname;
  
  // For localhost development, check URL format
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for subdomain param in URL for local development
    const urlSearchParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlSearchParams.get('subdomain');
    if (subdomainParam) {
      return subdomainParam;
    }
    
    // Alternative: check for subdomain.localhost pattern
    const parts = hostname.split('.');
    if (parts.length > 1 && !MAIN_DOMAIN_IDENTIFIERS.includes(parts[0])) {
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
  
  // Production domain handling
  // Explicitly handle the nestcrm.com.au domain as the main domain
  if (hostname === MAIN_DOMAIN || hostname === 'www.' + MAIN_DOMAIN) {
    return null;
  }
  
  // For other subdomains under nestcrm.com.au
  if (hostname.endsWith(MAIN_DOMAIN)) {
    const subdomain = hostname.replace('.' + MAIN_DOMAIN, '');
    // Only return if it's not www or nestcrm
    if (!MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      return subdomain;
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
  return subdomainRegex.test(subdomain) && subdomain.length >= 3 && !MAIN_DOMAIN_IDENTIFIERS.includes(subdomain);
};

/**
 * Determines if the current domain is the main/root domain
 * @param subdomain The current subdomain
 * @returns Boolean indicating if this is the main domain
 */
export const isMainDomain = (subdomain: string | null): boolean => {
  return !subdomain || MAIN_DOMAIN_IDENTIFIERS.includes(subdomain);
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
  if (host === MAIN_DOMAIN || host === 'www.' + MAIN_DOMAIN || MAIN_DOMAIN_IDENTIFIERS.includes(host)) {
    return `${protocol}//${subdomain}.${MAIN_DOMAIN}${path}`;
  }
  
  // If we're already on a subdomain 
  const domainParts = host.split('.');
  if (domainParts.length >= 2) {
    // For domain.nestcrm.com.au to newdomain.nestcrm.com.au
    const baseDomain = domainParts.slice(1).join('.');
    return `${protocol}//${subdomain}.${baseDomain}${path}`;
  }
  
  // Fallback
  return path;
};
