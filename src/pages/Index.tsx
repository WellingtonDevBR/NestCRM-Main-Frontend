
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { OrganizationRedirectButton } from "@/components/OrganizationRedirectButton";
import { useAuth } from "@/hooks/useAuth";
import { getSubdomainFromUrl, isMainDomain } from "@/utils/domainUtils";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const subdomain = getSubdomainFromUrl();
  const onMainDomain = isMainDomain(subdomain);
  
  // Show call to action for authenticated users at the top
  const showRedirectButton = isAuthenticated && onMainDomain;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Add redirect button for authenticated users on main domain */}
      {showRedirectButton && (
        <div className="container mx-auto mt-4 px-4">
          <div className="bg-muted/50 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Welcome back!</h3>
              <p className="text-muted-foreground">You're already logged in. Return to your dashboard?</p>
            </div>
            <OrganizationRedirectButton />
          </div>
        </div>
      )}
      
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
