
/**
 * Utilities for handling domain and subdomain logic
 */

// Export main domain constants
export const MAIN_DOMAIN = 'nestcrm.com.au';
export const MAIN_DOMAIN_IDENTIFIERS = ['nestcrm', 'www'];

/**
 * Extracts the subdomain from the current URL
 * @returns The subdomain string or null if on the main domain
 */
export const getSubdomainFromUrl = (): string | null => {
  const hostname = window.location.hostname;
  
  console.log(`Current hostname: "${hostname}"`);
  
  // Force main domain detection from global flag if set
  if (window.__MAIN_DOMAIN_DETECTED) {
    console.log('Main domain detected via global flag');
    return null;
  }
  
  // CRITICAL FIX: More reliable detection for local development environments
  const isDevelopmentEnvironment = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.includes('lovableproject.com') ||
    hostname.includes('netlify.app') || 
    hostname.includes('vercel.app');
    
  if (isDevelopmentEnvironment) {
    // Check for subdomain param in URL for local development
    const urlSearchParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlSearchParams.get('subdomain');
    if (subdomainParam) {
      console.log(`Development with subdomain param: ${subdomainParam}`);
      return subdomainParam;
    }
    
    // For localhost.subdomain pattern or lovableproject.com pattern
    if (hostname.includes('.')) {
      const parts = hostname.split('.');
      // Check if first part is a development-specific pattern to ignore
      const knownDevPatterns = ['localhost', 'www', '127', 'netlify', 'vercel'];
      const isDevPart = knownDevPatterns.some(pattern => parts[0].includes(pattern));
      
      if (!isDevPart && !MAIN_DOMAIN_IDENTIFIERS.includes(parts[0])) {
        console.log(`Development with subdomain format: ${parts[0]}`);
        return parts[0];
      }
    }
    
    console.log('Development without subdomain');
    return null;
  }
  
  // Main domain check: nestcrm.com.au or www.nestcrm.com.au should return null
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    console.log(`Main domain detected: ${hostname}`);
    return null;
  }
  
  // Special case for nestcrm without domain suffix
  if (hostname === 'nestcrm') {
    console.log('Detected nestcrm without domain suffix');
    return null;
  }
  
  // Check for subdomains under the main domain
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${MAIN_DOMAIN}`, '');
    
    // Only return if it's not www or nestcrm
    if (!MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) {
      console.log(`Valid subdomain detected: ${subdomain}`);
      return subdomain;
    }
    
    console.log(`Main domain identifier detected: ${subdomain}`);
    return null;
  }
  
  // Fallback - treat unknown domains as having no subdomain
  console.log(`Unknown domain structure: ${hostname}, treating as main domain`);
  return null;
};

/**
 * Checks if a given subdomain is valid
 * @param subdomain The subdomain to validate
 * @returns A regex test result
 */
export const isValidSubdomainFormat = (subdomain: string): boolean => {
  if (!subdomain) return false;
  
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
  // Force main domain detection from global flag if set
  if (window.__MAIN_DOMAIN_DETECTED) {
    return true;
  }
  
  // If on the main hostname, always return true
  const hostname = window.location.hostname;
  if (hostname === MAIN_DOMAIN || hostname === `www.${MAIN_DOMAIN}`) {
    return true;
  }
  
  // Check subdomain
  if (!subdomain) return true;
  if (MAIN_DOMAIN_IDENTIFIERS.includes(subdomain)) return true;
  return false;
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
  
  // If on development environment, use query param
  if (hostname.includes('localhost') || 
      hostname.includes('127.0.0.1') || 
      hostname.includes('lovableproject.com') ||
      hostname.includes('netlify.app') || 
      hostname.includes('vercel.app')) {
    return `${path}?subdomain=${subdomain}`;
  }
  
  // If we're on the main domain
  if (hostname === MAIN_DOMAIN || 
      hostname === `www.${MAIN_DOMAIN}` || 
      MAIN_DOMAIN_IDENTIFIERS.includes(hostname)) {
    return `${protocol}//${subdomain}.${MAIN_DOMAIN}${path}`;
  }
  
  // If we're already on a subdomain
  if (hostname.endsWith(`.${MAIN_DOMAIN}`)) {
    return `${protocol}//${subdomain}.${MAIN_DOMAIN}${path}`;
  }
  
  // Fallback
  return `${protocol}//${subdomain}.${MAIN_DOMAIN}${path}`;
};

// Add TypeScript declaration to ensure window property is available
declare global {
  interface Window {
    __MAIN_DOMAIN_DETECTED?: boolean;
  }
}
