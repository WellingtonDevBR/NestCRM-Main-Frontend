
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useOrganization } from "@/hooks/useOrganization";
import { useAuth } from "@/hooks/useAuth";

const Onboarding = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { createOrganization, isValidSubdomain } = useOrganization();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Organization info
  const [orgName, setOrgName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleSubdomainChange = async (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(cleaned);
    
    if (cleaned.length >= 3) {
      const valid = await isValidSubdomain(cleaned);
      setSubdomainAvailable(valid);
    } else {
      setSubdomainAvailable(null);
    }
  };

  const handleCreateTenant = async () => {
    if (!orgName || !subdomain) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (subdomain.length < 3) {
      toast.error("Subdomain must be at least 3 characters");
      return;
    }

    if (!subdomainAvailable) {
      toast.error("This subdomain is not available");
      return;
    }

    setIsLoading(true);
    try {
      const org = await createOrganization(orgName, subdomain);
      if (org) {
        toast.success("Your organization is ready!", {
          description: "Redirecting to your dashboard..."
        });
        
        // In a production environment, we would redirect to the subdomain here
        // For now, we'll just redirect to the dashboard
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (error) {
      console.error("Error in onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <div className="flex flex-1 flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
              {step === 1 ? "Set up your organization" : "Final steps"}
            </h2>
            <p className="mt-2 text-center text-sm text-foreground/70">
              {step === 1
                ? "Create your organization and choose your subdomain"
                : "Just a few more details and you're all set"}
            </p>
          </div>

          <div className="bg-white p-8 shadow-md rounded-lg border border-border">
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organization-name">Organization Name</Label>
                  <Input
                    id="organization-name"
                    placeholder="Acme Inc."
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">
                    Subdomain
                    {subdomainAvailable === true && (
                      <span className="ml-2 text-sm text-green-600">✓ Available</span>
                    )}
                    {subdomainAvailable === false && (
                      <span className="ml-2 text-sm text-red-600">Not available</span>
                    )}
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="subdomain"
                      placeholder="acmeinc"
                      value={subdomain}
                      onChange={(e) => handleSubdomainChange(e.target.value)}
                      className="rounded-r-none"
                      required
                    />
                    <span className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-muted-foreground">
                      .nestcrm.com.au
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This will be your unique URL. Use only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <Button
                  onClick={handleCreateTenant}
                  className="w-full"
                  disabled={isLoading || !orgName || !subdomain || !subdomainAvailable}
                >
                  {isLoading ? "Creating..." : "Create Organization"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
