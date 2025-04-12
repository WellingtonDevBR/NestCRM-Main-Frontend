
/**
 * Domain models for authentication
 */

export interface TenantInfo {
  company: string;
  subdomain: string;
  domain: string;
}

export interface User {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthToken {
  token: string;
  expiresAt?: Date;
}

export interface AuthenticatedSession {
  user?: User;
  tenant: TenantInfo;
  token?: AuthToken; // Make token optional since we're using cookies
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SubscriptionData {
  planId: string;
  currency: string;
  interval: string;
  amount: number;
  trialDays: number;
  trialEndsAt?: string;
  status: 'trialing' | 'active' | 'canceled' | 'incomplete';
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  subdomain: string;
  password: string;
  planId?: string; // Add planId for subscription information
  currency?: string; // Add currency code
  subscription?: SubscriptionData; // Add subscription data
}

export interface AuthResult {
  success: boolean;
  session?: AuthenticatedSession;
  error?: {
    message: string;
    code?: string;
  };
}
