
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TenantInfo } from "@/domain/auth/types";
import { toast } from "sonner";

interface AuthButtonsProps {
  isAuthenticated: boolean;
  tenant: TenantInfo | null;
  isMobile?: boolean;
  onButtonClick?: () => void;
}

const AuthButtons = ({ isAuthenticated, tenant, isMobile = false, onButtonClick = () => {} }: AuthButtonsProps) => {
  const handleDashboardClick = (e: React.MouseEvent) => {
    console.log('Dashboard button clicked, redirecting to tenant domain');
    
    if (tenant && tenant.domain) {
      toast.loading("Connecting to your dashboard...");
      
      // Direct navigation to tenant domain/dashboard
      const protocol = window.location.protocol;
      const url = `${protocol}//${tenant.domain}/dashboard`;
      window.location.replace(url);
    } else {
      toast.error("Could not determine your workspace");
    }
  };

  if (isAuthenticated && tenant) {
    return (
      <a 
        href="#"
        onClick={(e) => {
          handleDashboardClick(e);
          onButtonClick();
        }}
        className={`button-gradient inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${isMobile ? "w-full text-center" : ""}`}
      >
        Dashboard
      </a>
    );
  }

  return (
    <>
      <Link to="/login" onClick={onButtonClick}>
        <Button 
          variant="outline" 
          className={`border-purple-300 hover:bg-purple-50 ${isMobile ? "w-full" : ""}`}
        >
          Log in
        </Button>
      </Link>
      <Link to="/signup" onClick={onButtonClick}>
        <Button 
          className={`button-gradient ${isMobile ? "w-full" : ""}`}
        >
          Sign up
        </Button>
      </Link>
    </>
  );
};

export default AuthButtons;
