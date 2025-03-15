
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";
import { redirectToOrganization } from "@/utils/organizationUtils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect } from "react";

export const OrganizationRedirectButton = () => {
  const { isAuthenticated, user } = useAuth();
  const { currentOrganization, organizations } = useOrganization();
  const navigate = useNavigate();

  // Force check authentication status on component mount
  // This helps clean up any stale state
  useEffect(() => {
    if (!user && isAuthenticated) {
      console.log('Authentication state inconsistent - refreshing');
      window.location.reload();
    }
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleRedirect = () => {
    // If there's a current organization, redirect to its subdomain
    if (currentOrganization) {
      toast.info(`Redirecting to ${currentOrganization.name} dashboard...`);
      redirectToOrganization(currentOrganization);
      return;
    }
    
    // If user has organizations but no current one is set
    if (organizations.length > 0) {
      toast.info(`Redirecting to ${organizations[0].name} dashboard...`);
      redirectToOrganization(organizations[0]);
      return;
    }
    
    // If no organizations, go to organizations page
    toast.info("Please select or create an organization first");
    navigate("/organizations");
  };

  return (
    <Button 
      variant="default"
      className="flex items-center gap-2 shadow-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all" 
      onClick={handleRedirect}
    >
      Dashboard
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};
