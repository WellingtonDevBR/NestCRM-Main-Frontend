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
import Predictions from "./pages/Predictions";
import RiskAlerts from "./pages/RiskAlerts";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import HelpAndSupport from "./pages/HelpAndSupport";
import NotFound from "./pages/NotFound";
import * as React from "react";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import Settings from "./pages/Settings";
import CustomFields from "./pages/CustomFields";
import PredictionMapping from "./pages/PredictionMapping";
import AppLayout from "./components/dashboard/AppLayout";
import Profile from "./pages/Profile";
import GeneralSettings from "./pages/GeneralSettings";

// Create a function component for our app
const App: React.FC = () => {
  // Create a new QueryClient instance
  const queryClient = new QueryClient();

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
            
            {/* Prediction and analytics routes */}
            <Route path="/predictions" element={
              <AppLayout>
                <Predictions />
              </AppLayout>
            } />
            <Route path="/risk-alerts" element={
              <AppLayout>
                <RiskAlerts />
              </AppLayout>
            } />
            <Route path="/analytics" element={
              <AppLayout>
                <Analytics />
              </AppLayout>
            } />
            
            {/* New reports and help & support routes */}
            <Route path="/reports" element={
              <AppLayout>
                <Reports />
              </AppLayout>
            } />
            <Route path="/help-support" element={
              <AppLayout>
                <HelpAndSupport />
              </AppLayout>
            } />
            
            {/* Settings routes */}
            <Route path="/settings" element={
              <AppLayout>
                <Settings />
              </AppLayout>
            } />
            <Route path="/settings/general" element={
              <AppLayout>
                <GeneralSettings />
              </AppLayout>
            } />
            <Route path="/settings/custom-fields" element={
              <AppLayout>
                <CustomFields />
              </AppLayout>
            } />
            <Route path="/settings/prediction-mapping" element={
              <AppLayout>
                <PredictionMapping />
              </AppLayout>
            } />
            
            {/* Profile page */}
            <Route path="/profile" element={
              <AppLayout>
                <Profile />
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
