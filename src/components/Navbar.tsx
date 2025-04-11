
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading, tenant, redirectToTenantDomain } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleDashboardClick = () => {
    console.log('Dashboard button clicked, redirecting to tenant domain');
    if (tenant) {
      toast.loading("Connecting to your dashboard...");
      redirectToTenantDomain(tenant);
    }
  };

  // Get current auth state when rendering, don't just rely on context
  // This ensures we always have the most up-to-date auth state
  const showAuthButtons = !loading;
  console.log('Navbar rendering, authentication state:', isAuthenticated);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center"
          >
            <img 
              src="/lovable-uploads/f331213a-aeba-40ff-a2df-5d1da1bc386f.png" 
              alt="NestCRM Logo" 
              className="h-8 w-8 mr-2" 
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">NESTCRM</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-foreground/80 hover:text-purple-600 transition-colors"
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-foreground/80 hover:text-purple-600 transition-colors"
            >
              Features
            </a>
            <Link
              to="/pricing"
              className="text-foreground/80 hover:text-purple-600 transition-colors"
            >
              Pricing
            </Link>
            <a
              href="#testimonials"
              className="text-foreground/80 hover:text-purple-600 transition-colors"
            >
              Testimonials
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {showAuthButtons && (
              isAuthenticated && tenant ? (
                <Button 
                  onClick={handleDashboardClick} 
                  className="button-gradient"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="outline" className="border-purple-300 hover:bg-purple-50">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="button-gradient">Sign up</Button>
                  </Link>
                </>
              )
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-foreground/80 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <a
              href="#features"
              className="text-foreground/80 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <Link
              to="/pricing"
              className="text-foreground/80 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <a
              href="#testimonials"
              className="text-foreground/80 hover:text-purple-600 transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Testimonials
            </a>
            {showAuthButtons && (
              isAuthenticated && tenant ? (
                <div className="pt-2">
                  <Button 
                    onClick={handleDashboardClick} 
                    className="w-full button-gradient"
                  >
                    Dashboard
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full border-purple-300 hover:bg-purple-50">
                      Log in
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full button-gradient">Sign up</Button>
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
