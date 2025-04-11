
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Cookie, X, Check } from "lucide-react";

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const cookieConsent = localStorage.getItem("cookie-consent");
    if (cookieConsent === null) {
      // Only show banner if user hasn't made a choice yet
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm bg-white dark:bg-sidebar-background rounded-lg shadow-lg border border-border p-4">
      <div className="flex items-center gap-3 mb-2">
        <Cookie className="h-5 w-5 text-primary" />
        <h3 className="font-medium text-lg">Cookie Notice</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </p>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="default" 
          size="sm"
          className="flex items-center gap-1"
          onClick={acceptCookies}
        >
          <Check className="h-4 w-4" />
          Accept
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={declineCookies}
        >
          <X className="h-4 w-4" />
          Decline
        </Button>
        
        <Link to="/cookie-policy">
          <Button 
            variant="link" 
            size="sm"
            className="text-xs"
          >
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CookieBanner;
