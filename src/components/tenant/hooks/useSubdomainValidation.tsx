
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubdomainFromUrl, isMainDomain } from '@/utils/domainUtils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hook that validates if the current subdomain exists and is valid
 */
export const useSubdomainValidation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubdomainValid, setIsSubdomainValid] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  // Check if the current subdomain is valid
  useEffect(() => {
    const checkSubdomainValidity = async () => {
      const subdomain = getSubdomainFromUrl();
      
      // If there's no subdomain or we're on the main domain, it's valid
      if (!subdomain || isMainDomain(subdomain)) {
        setIsSubdomainValid(true);
        return;
      }
      
      try {
        // Try to fetch the subdomain's organization
        const { data, error } = await supabase
          .from('organizations')
          .select('id, name')
          .eq('subdomain', subdomain)
          .maybeSingle();
          
        // If not found, set as invalid
        if (error || !data) {
          console.error('⚠️ Subdomain Validation: Invalid subdomain detected:', subdomain);
          setIsSubdomainValid(false);
        } else {
          setIsSubdomainValid(true);
        }
      } catch (err) {
        console.error('❌ Error checking subdomain validity:', err);
        // Default to valid to avoid blocking legitimate traffic
        setIsSubdomainValid(true);
      }
    };
    
    // Only check for authenticated users or on dashboard paths
    if (isAuthenticated || location.pathname.includes('/dashboard')) {
      checkSubdomainValidity();
    }

    setIsChecking(false);
  }, [isAuthenticated, location.pathname]);

  // Redirect to 404 if invalid subdomain
  useEffect(() => {
    if (!isSubdomainValid && !isChecking) {
      console.log('⚠️ Redirecting to 404: Invalid subdomain detected');
      navigate('/not-found', { replace: true });
    }
  }, [isSubdomainValid, isChecking, navigate]);

  return { isSubdomainValid, isChecking };
};
