
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  // Use try/catch to prevent app crashes if auth context is not available
  let isAuthenticated = false;
  
  try {
    const auth = useAuth();
    isAuthenticated = auth.isAuthenticated;
    
    // Log authentication state on component mount for debugging
    useEffect(() => {
      console.log('Index page - Authentication state:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
      if (auth.tenant) {
        console.log('User has tenant:', auth.tenant);
      }
    }, [isAuthenticated, auth.tenant]);
  } catch (error) {
    console.error('Error accessing auth context:', error);
    // Continue rendering the page without auth features
  }
  
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
