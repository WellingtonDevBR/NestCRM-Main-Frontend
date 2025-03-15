
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { getSubdomainFromUrl, isMainDomain } from "@/utils/domainUtils";
import { redirectToOrganization } from "@/utils/organizationUtils";
import { toast } from "sonner";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { isAuthenticated } = useAuth();
  const { currentOrganization, organizations } = useOrganization();
  const navigate = useNavigate();
  
  // Handle main domain access protection
  useEffect(() => {
    const handleMainDomainAccess = async () => {
      const subdomain = getSubdomainFromUrl();
      
      // If we're on the main domain and the user is authenticated
      if (isMainDomain(subdomain) && isAuthenticated) {
        console.log("Main domain dashboard access - checking redirections");
        
        // If there's a current organization, redirect to its subdomain dashboard
        if (currentOrganization) {
          console.log("Main domain dashboard access - redirecting to organization subdomain:", 
            currentOrganization.subdomain);
          toast.info("Redirecting to your organization dashboard...");
          redirectToOrganization(currentOrganization);
          return;
        }
        
        // If user has organizations but no current one is set
        if (organizations.length > 0) {
          console.log("Main domain dashboard access - redirecting to first organization:", 
            organizations[0].subdomain);
          toast.info("Redirecting to your organization dashboard...");
          redirectToOrganization(organizations[0]);
          return;
        }
        
        // If no organization but authenticated, redirect to organizations page
        console.log("Main domain dashboard access - redirecting to organizations page");
        toast.info("Please select or create an organization first");
        navigate("/organizations", { replace: true });
        return;
      }
      
      // If on main domain and not authenticated, redirect to home
      if (isMainDomain(subdomain) && !isAuthenticated) {
        console.log("Main domain dashboard access - unauthenticated, redirecting to home");
        toast.error("Please log in to access the dashboard");
        navigate("/", { replace: true });
        return;
      }
    };
    
    handleMainDomainAccess();
  }, [isAuthenticated, currentOrganization, organizations, navigate]);

  return (
    <div className="flex h-screen bg-secondary/30">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <Header />

        {/* Dashboard content */}
        <DashboardContent />
      </div>
    </div>
  );
};

export default Dashboard;
