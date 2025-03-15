
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TenantCheckerProps {
  children: React.ReactNode;
}

/**
 * Component for logging tenant routing information
 */
export const TenantChecker = ({ children }: TenantCheckerProps) => {
  const location = useLocation();
  
  // Log component lifecycle
  useEffect(() => {
    console.log('🔄 TenantRedirector: Component mounted/updated');
    console.log('🔄 TenantRedirector: Current path -', location.pathname);
    
    return () => {
      console.log('🔄 TenantRedirector: Component unmounting');
    };
  }, [location.pathname]);

  return <>{children}</>;
};
