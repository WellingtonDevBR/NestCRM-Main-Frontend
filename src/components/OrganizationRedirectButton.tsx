
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { redirectToOrganization } from "@/utils/organizationUtils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OrganizationRedirectButton = () => {
  const { isAuthenticated } = useAuth();
  const { currentOrganization, organizations } = useOrganization();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null;
  }

  const handleRedirect = () => {
    // If there's a current organization, redirect to its subdomain
    if (currentOrganization) {
      redirectToOrganization(currentOrganization);
      return;
    }
    
    // If user has organizations but no current one is set
    if (organizations.length > 0) {
      // Redirect to the first organization
      redirectToOrganization(organizations[0]);
      return;
    }
    
    // If no organizations, go to organizations page
    navigate("/organizations");
  };

  return (
    <Button 
      className="mt-4 flex items-center" 
      onClick={handleRedirect}
    >
      Return to Dashboard
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  );
};
