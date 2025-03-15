
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
import { supabase } from "@/integrations/supabase/client";
import type { Organization } from "@/types/supabase";
import { MAIN_DOMAIN } from "@/utils/domainUtils";

const OrganizationsPage = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const {
    organizations,
    loading: orgLoading,
    fetchOrganizations,
    switchOrganization,
    getSubdomainFromUrl
  } = useOrganization();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userOrganizations, setUserOrganizations] = useState<Organization[]>([]);

  // Fetch only organizations the current user is a member of
  useEffect(() => {
    const fetchUserOrganizations = async () => {
      if (!isAuthenticated || !user?.id) return;
      
      try {
        console.log('Fetching organization memberships for user:', user.id);
        
        // Fetch organization memberships for current user
        const { data: memberships, error: membershipError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', user.id);
          
        if (membershipError) {
          console.error('Error fetching user organization memberships:', membershipError);
          return;
        }
        
        console.log('Found memberships:', memberships?.length || 0);
        
        if (memberships && memberships.length > 0) {
          const orgPromises = memberships.map(membership => 
            supabase
              .from('organizations')
              .select('*')
              .eq('id', membership.organization_id)
              .single()
          );
          
          const orgResults = await Promise.all(orgPromises);
          const validOrgs = orgResults
            .filter(result => !result.error && result.data)
            .map(result => result.data as Organization);
          
          console.log('Retrieved organizations:', validOrgs.length);
          setUserOrganizations(validOrgs);
          
          // If there's only one organization, redirect to it directly
          if (validOrgs.length === 1) {
            console.log('User has only one organization, redirecting to it:', validOrgs[0].name);
            handleSelectOrganization(validOrgs[0].id, validOrgs[0].subdomain);
          }
        } else {
          setUserOrganizations([]);
        }
      } catch (error) {
        console.error('Error processing user organizations:', error);
      }
    };
    
    if (isAuthenticated && !orgLoading) {
      fetchOrganizations().then(() => fetchUserOrganizations());
    }
  }, [isAuthenticated, orgLoading, user, organizations]);

  // If not authenticated, redirect to login
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleSelectOrganization = async (id: string, subdomain: string) => {
    setIsLoading(true);
    try {
      await switchOrganization(id);
      
      toast.success(`Switching to ${subdomain} organization`, {
        description: "Redirecting to dashboard..."
      });
      
      // Direct redirection to subdomain
      const protocol = window.location.protocol;
      const host = window.location.host;
      
      // If on localhost or development environment, use query parameter
      if (host.includes('localhost') || 
          host.includes('127.0.0.1') || 
          host.includes('lovableproject.com') ||
          host.includes('netlify.app') || 
          host.includes('vercel.app')) {
        console.log('Development environment detected, navigating with query parameter');
        navigate(`/dashboard?subdomain=${subdomain}`);
        return;
      }
      
      // In production, redirect to the subdomain directly
      console.log('Production environment detected, redirecting to subdomain');
      const url = `${protocol}//${subdomain}.${MAIN_DOMAIN}/dashboard`;
      console.log('Redirecting to:', url);
      
      // Use a small timeout to ensure the toast is visible
      setTimeout(() => {
        window.location.href = url;
      }, 500);
    } catch (error) {
      console.error("Error selecting organization:", error);
      toast.error("Failed to select organization");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || orgLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          {userOrganizations.length > 0 ? (
            userOrganizations.map((org) => (
              <Card key={org.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{org.name}</CardTitle>
                  <CardDescription>{org.subdomain}.nestcrm.com.au</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-12 flex items-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSelectOrganization(org.id, org.subdomain)}
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
