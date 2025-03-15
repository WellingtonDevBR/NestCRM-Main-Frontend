
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

const OrganizationsPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    organizations,
    loading: orgLoading,
    fetchOrganizations,
    switchOrganization,
    getSubdomainFromUrl
  } = useOrganization();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !orgLoading) {
      fetchOrganizations();
    }
  }, [isAuthenticated]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <p>Loading...</p>
      </div>
    );
  }

  const handleSelectOrganization = async (id: string) => {
    setIsLoading(true);
    try {
      await switchOrganization(id);
      
      // In a production app, we'd redirect to the organization's subdomain
      // For this demo, we'll just go to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error selecting organization:", error);
      toast.error("Failed to select organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Organizations</h1>
          <p className="text-foreground/70 mt-2">
            Select an organization to access its dashboard or create a new one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.length > 0 ? (
            organizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.subdomain}.yourdomain.com</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-12 flex items-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSelectOrganization(org.id)}
                    disabled={isLoading}
                  >
                    Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>No Organizations Yet</CardTitle>
                <CardDescription>
                  Create your first organization to get started
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button
                  onClick={() => navigate("/create-organization")}
                  className="w-full"
                >
                  Create Organization
                </Button>
              </CardFooter>
            </Card>
          )}

          <Card className="border-dashed hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Create New Organization</CardTitle>
              <CardDescription>
                Set up a new workspace with its own subdomain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-12 flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/create-organization")}
              >
                Create Organization
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizationsPage;
