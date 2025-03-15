
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook for handling cross-domain authentication redirects
 */
export const useCrossDomainAuth = () => {
  const { isAuthenticated, user } = useAuth();
  const { organizations, currentOrganization } = useOrganization();
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);

  useEffect(() => {
    // Check if this is a subdomain auth redirect
    const searchParams = new URLSearchParams(window.location.search);
    const isAuthRedirect = searchParams.get('auth_redirect') === 'true';
    const orgId = searchParams.get('org_id');
    
    if (isAuthRedirect && !isProcessingAuth) {
      setIsProcessingAuth(true);
      console.log('🔑 Cross-domain auth: Detected authentication redirect');
      
      const processAuthRedirect = async () => {
        try {
          // Verify we have a session
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('🔑 Cross-domain auth: Session error:', sessionError);
            toast.error('Authentication error', {
              description: 'Your session could not be verified. Please try logging in again.'
            });
            return;
          }
          
          if (!sessionData.session) {
            console.log('🔑 Cross-domain auth: No session found, attempting to restore');
            
            // Try to get auth cookies and restore session
            const cookiePrefix = 'sb-';
            const authCookies = document.cookie
              .split(';')
              .map(cookie => cookie.trim())
              .filter(cookie => cookie.startsWith(cookiePrefix));
              
            console.log('🔑 Cross-domain auth: Found auth cookies:', authCookies.length);
            
            if (authCookies.length > 0) {
              try {
                // Specifically look for access and refresh tokens
                const accessTokenCookie = document.cookie
                  .split(';')
                  .map(cookie => cookie.trim())
                  .find(cookie => cookie.startsWith('sb-auth-token='));
                  
                const refreshTokenCookie = document.cookie
                  .split(';')
                  .map(cookie => cookie.trim())
                  .find(cookie => cookie.startsWith('sb-refresh-token='));
                  
                if (accessTokenCookie && refreshTokenCookie) {
                  const accessToken = accessTokenCookie.split('=')[1];
                  const refreshToken = refreshTokenCookie.split('=')[1];
                  
                  console.log('🔑 Cross-domain auth: Attempting to restore session with tokens');
                  
                  const { error: setSessionError } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                  });
                  
                  if (setSessionError) {
                    console.error('🔑 Cross-domain auth: Error restoring session:', setSessionError);
                  } else {
                    console.log('🔑 Cross-domain auth: Successfully restored session');
                  }
                } else {
                  console.log('🔑 Cross-domain auth: Required auth cookies not found');
                }
              } catch (restoreError) {
                console.error('🔑 Cross-domain auth: Error restoring session:', restoreError);
              }
            }
          } else {
            console.log('🔑 Cross-domain auth: Valid session found');
          }
          
          // If we have a valid session now, clean up the URL
          if (isAuthenticated) {
            console.log('🔑 Cross-domain auth: Cleaning up URL after successful redirect');
            // Clean up the URL
            navigate('/dashboard', { replace: true });
          } else {
            console.log('🔑 Cross-domain auth: Still not authenticated after redirect');
            toast.error('Authentication failed', {
              description: 'Your session could not be verified. Please try logging in again.'
            });
            
            // Redirect back to main domain for a fresh login
            const mainDomain = import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173';
            window.location.href = `${window.location.protocol}//${mainDomain}/login`;
          }
        } finally {
          setIsProcessingAuth(false);
        }
      };
      
      processAuthRedirect();
    }
  }, [location.search, isAuthenticated, location.pathname, navigate, isProcessingAuth]);

  return { isProcessingAuth };
};
