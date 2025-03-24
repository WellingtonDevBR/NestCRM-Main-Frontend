
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import React from "react";
import { isOnDashboardSubdomain } from "@/utils/subdomain";

// Create a function component for our app
const App: React.FC = () => {
  // Create QueryClient instance inside the component using useState instead of useMemo directly
  // This ensures the hook is called within the component body
  const [queryClient] = React.useState(() => new QueryClient());

  // If we're not on a subdomain, redirect to main site
  React.useEffect(() => {
    if (!isOnDashboardSubdomain()) {
      window.location.href = "https://nestcrm.com.au";
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
