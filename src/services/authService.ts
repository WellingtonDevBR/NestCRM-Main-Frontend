
import { authService as domainAuthService } from "@/domain/auth/authService";
import { authStateService } from "@/domain/auth/authStateService";
import { tenantService } from "@/domain/tenant/tenantService";

/**
 * Facade service that combines all auth-related services
 * This maintains backwards compatibility with existing code
 */
class AuthServiceFacade {
  // Auth core methods
  signIn = domainAuthService.signIn.bind(domainAuthService);
  signUp = domainAuthService.signUp.bind(domainAuthService);
  signOut = domainAuthService.signOut.bind(domainAuthService);
  
  // Auth state methods
  isAuthenticated = authStateService.isAuthenticated.bind(authStateService);
  verifyAuthentication = authStateService.verifyAuthentication.bind(authStateService);
  validateAuthCookie = authStateService.validateAuthCookie.bind(authStateService);
  getCurrentTenant = authStateService.getCurrentTenant.bind(authStateService);
  getCurrentToken = authStateService.getCurrentToken.bind(authStateService);
  
  // Tenant methods
  checkTenantStatus = tenantService.checkTenantStatus.bind(tenantService);
  redirectToTenantDomain = tenantService.redirectToTenantDomain.bind(tenantService);
}

// Export a singleton instance that maintains the original API
export const authService = new AuthServiceFacade();

// Re-export types for convenience
export type {
  TenantInfo,
  LoginCredentials,
  SignUpData,
  AuthResult,
  AuthenticatedSession
} from "@/domain/auth/types";
