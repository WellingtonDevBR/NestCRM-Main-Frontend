
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubdomainFromUrl, isMainDomain } from "@/utils/domainUtils";
import { toast } from "sonner";

const Index = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Check if on tenant subdomain and redirect
  useEffect(() => {
    const subdomain = getSubdomainFromUrl();
    
    // If we're on a tenant subdomain (not the main domain)
    if (subdomain && !isMainDomain(subdomain)) {
      console.log(`Tenant subdomain detected on index page: ${subdomain}`);
      
      // Redirect to dashboard if authenticated
      if (isAuthenticated) {
        console.log("Authenticated user on tenant subdomain index - redirecting to dashboard");
        toast.info("Redirecting to your dashboard...");
        navigate("/dashboard", { replace: true });
      } else {
        // If not authenticated, redirect to main domain for login
        // Store the subdomain in the URL as a parameter for the login page to use
        console.log("Unauthenticated user on tenant subdomain index - redirecting to main domain for login");
        toast.info("Redirecting to login...");
        
        const mainDomain = import.meta.env.PROD ? 'nestcrm.com.au' : 'localhost:5173';
        window.location.href = `${window.location.protocol}//${mainDomain}/login?tenant=${subdomain}`;
      }
      return;
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
