
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo, NavLinks, AuthButtons, MobileMenu } from "@/components/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, loading, tenant } = useAuth();

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
          <Logo />

          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {showAuthButtons && (
              <AuthButtons isAuthenticated={isAuthenticated} tenant={tenant} />
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

      <MobileMenu 
        isOpen={isMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        tenant={tenant}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;
