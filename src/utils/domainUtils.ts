
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
  
  console.log(`Current hostname: "${hostname}"`);
  
  // For localhost development, check URL format
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for subdomain param in URL for local development
    const urlSearchParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlSearchParams.get('subdomain');
    if (subdomainParam) {
      console.log(`Local development with subdomain param: ${subdomainParam}`);
      return subdomainParam;
    }
    
    // Alternative: check for subdomain.localhost pattern
    const parts = hostname.split('.');
    if (parts.length > 1 && !MAIN_DOMAIN_IDENTIFIERS.includes(parts[0])) {
      console.log(`Local development with subdomain format: ${parts[0]}`);
      return parts[0];
    }
    console.log('Local development without subdomain');
    return null;
  }
  
  // Handle Netlify/Vercel/Lovable preview URLs by returning null (no subdomain)
  if (hostname.includes('netlify.app') || 
      hostname.includes('vercel.app') || 
      hostname.includes('lovableproject.com')) {
    console.log(`Development/preview URL detected: ${hostname}`);
    return null;
  }
  
  // Production domain handling
  
  // Check if this is exactly the main domain or www.main_domain
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    console.log(`Detected exact main domain: ${hostname}`);
    return null;
  }
  
  // Special case for just "nestcrm" without domain
  if (hostname === 'nestcrm') {
    console.log('Detected nestcrm without domain suffix, treating as main domain');
    return null;
  }
  
  // For other subdomains under nestcrm.com.au
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${MAIN_DOMAIN}`, '');
    
    // Only return if it's not www or nestcrm
    if (!MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      console.log(`Detected valid subdomain: ${subdomain}`);
      return subdomain;
    }
    
    console.log(`Detected main domain identifier: ${subdomain}`);
    return null;
  }
  
  // For any other domain, assume no subdomain
  console.log(`Unknown domain structure: ${hostname}, treating as main domain`);
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
  return subdomainRegex.test(subdomain) && 
         subdomain.length >= 3 && 
         !MAIN_DOMAIN_IDENTIFIERS.includes(subdomain);
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
  const hostname = window.location.hostname;
  
  // If on localhost, just return a query param version
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return `${path}?subdomain=${subdomain}`;
  }
  
  // Handle preview/development URLs
  if (hostname.includes('netlify.app') || 
      hostname.includes('vercel.app') || 
      hostname.includes('lovableproject.com')) {
    return `${path}?subdomain=${subdomain}`;
  }
  
  // In production, generate subdomain URL
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}` || 
      MAIN_DOMAIN_IDENTIFIERS.includes(hostname) || hostname === 'nestcrm') {
    return `${protocol}//${subdomain}.${MAIN_DOMAIN}${path}`;
  }
  
  // If we're already on a subdomain 
  const domainParts = hostname.split('.');
  if (domainParts.length >= 2) {
    // For domain.nestcrm.com.au to newdomain.nestcrm.com.au
    const baseDomain = domainParts.slice(1).join('.');
    return `${protocol}//${subdomain}.${baseDomain}${path}`;
  }
  
  // Fallback
  return path;
};
