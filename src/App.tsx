
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Interactions from "./pages/Interactions";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import React from "react";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import Settings from "./pages/Settings";
import CustomFields from "./pages/CustomFields";
import AppLayout from "./components/dashboard/AppLayout";

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
            
            {/* Dashboard routes - now using AppLayout */}
            <Route path="/dashboard" element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            } />
            <Route path="/customers" element={
              <AppLayout>
                <Customers />
              </AppLayout>
            } />
            <Route path="/orders" element={
              <AppLayout>
                <Orders />
              </AppLayout>
            } />
            <Route path="/payments" element={
              <AppLayout>
                <Payments />
              </AppLayout>
            } />
            <Route path="/interactions" element={
              <AppLayout>
                <Interactions />
              </AppLayout>
            } />
            <Route path="/support" element={
              <AppLayout>
                <Support />
              </AppLayout>
            } />
            <Route path="/settings" element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } />
            <Route path="/settings/custom-fields" element={
              <AppLayout>
                <CustomFields />
              </AppLayout>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
