
import { useEffect } from "react";

interface UseSubdomainSuggestionProps {
  email: string;
  companyName: string;
  subdomain: string;
  setCompanyName: (name: string) => void;
  setSubdomain: (subdomain: string) => void;
}

export const useSubdomainSuggestion = ({
  email,
  companyName,
  subdomain,
  setCompanyName,
  setSubdomain
}: UseSubdomainSuggestionProps) => {
  
  // Extract domain from email and use it for subdomain suggestion
  useEffect(() => {
    if (email && email.includes('@')) {
      const domain = email.split('@')[1];
      const domainName = domain.split('.')[0].toLowerCase();
      
      // Auto-populate company name if empty
      if (!companyName) {
        // Capitalize first letter of domain for company name suggestion
        const suggestedCompany = domainName.charAt(0).toUpperCase() + domainName.slice(1);
        setCompanyName(suggestedCompany);
      }
      
      // Auto-suggest subdomain (but don't force it)
      if (!subdomain) {
        setSubdomain(domainName);
      }
    }
  }, [email, companyName, subdomain, setCompanyName, setSubdomain]);
};
