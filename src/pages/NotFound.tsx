
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle, ChevronLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isOnDashboardPath, setIsOnDashboardPath] = useState(false);

  useEffect(() => {
    // Log the 404 error with additional context
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Authentication status:",
      isAuthenticated ? "Authenticated" : "Not authenticated"
    );

    // Check if we're trying to access the dashboard path
    if (location.pathname === '/dashboard' && isAuthenticated) {
      setIsOnDashboardPath(true);

      // Show toast notification to explain the situation
      toast.error("Unable to access the dashboard directly", {
        description: "Please select an organization first",
        duration: 5000
      });
    }
  }, [location.pathname, isAuthenticated]);

  const handleNavigateToOrganizations = () => {
    // Determine the correct organizations path
    const organizationsPath = '/organizations';
    navigate(organizationsPath);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-auto text-center p-8">
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-foreground">404</h1>
        <p className="text-xl font-medium mb-6 text-foreground">Page not found</p>

        <p className="text-muted-foreground mb-8">
          {isOnDashboardPath
            ? "To access the dashboard, you need to select an organization first."
            : "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}
        </p>

        {isAuthenticated ? (
          <div className="space-y-4">
            {isOnDashboardPath ? (
              <Button
                className="w-full"
                onClick={handleNavigateToOrganizations}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Go to Organizations
              </Button>
            ) : (
              <Button asChild className="w-full">
                <Link to="/organizations">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Organizations
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                Return to Home
              </Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default NotFound;
