
/**
 * Gets the subdomain from the current URL
 */
export function getSubdomainFromUrl(): string | null {
  const hostname = window.location.hostname;
  
  // For localhost development
  if (hostname === 'localhost') {
    return null;
  }
  
  // For production domains like sub.domain.com
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

/**
 * Checks if the given subdomain is the main domain
 */
export function isMainDomain(subdomain: string | null): boolean {
  if (!subdomain) return true;
  
  // Add any specific checks for main domain cases here
  // For example, if 'www' is considered a main domain
  return ['www'].includes(subdomain);
}

/**
 * Builds a URL with the specified subdomain
 */
export function buildSubdomainUrl(subdomain: string, path: string = '/'): string {
  const { protocol, hostname, port } = window.location;
  
  // For localhost development
  if (hostname === 'localhost') {
    return `${protocol}//${hostname}${port ? ':' + port : ''}${path}`;
  }
  
  // For production
  const domainParts = hostname.split('.');
  const domain = domainParts.length > 2 
    ? domainParts.slice(1).join('.') 
    : hostname;
  
  return `${protocol}//${subdomain}.${domain}${port ? ':' + port : ''}${path}`;
}
