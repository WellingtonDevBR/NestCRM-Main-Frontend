
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { getSubdomainFromUrl } from "@/utils/domainUtils";
import { useOrganization } from "@/hooks/useOrganization";

export function useLoginForm() {
  const { signIn, isAuthenticated } = useAuth();
  const { organizations } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      // Navigation will be handled by the signIn method
    } catch (error) {
      // Error is handled in the signIn method
      setIsLoading(false);
    }
  };

  const determineRedirectPath = () => {
    const subdomain = getSubdomainFromUrl();
    
    // If on a subdomain, go to dashboard
    if (subdomain) {
      return '/dashboard';
    } 
    // If on main domain and has organizations, go to organizations page
    else if (organizations.length > 0) {
      return '/organizations';
    }
    // If no organizations, go to onboarding
    else {
      return '/onboarding';
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
    isLoading,
    handleSubmit,
    isAuthenticated,
    determineRedirectPath
  };
}
