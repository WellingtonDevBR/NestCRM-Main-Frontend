
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Separate component for the sidebar toggle button to properly use the useSidebar hook
const SidebarToggleButton = () => {
  const { state } = useSidebar();
  
  return (
    <Button 
      variant="outline" 
      size="icon"
      className={`fixed top-4 left-4 z-50 shadow-md bg-white ${state === 'collapsed' ? 'block' : 'hidden'} md:block md:${state === 'expanded' ? 'hidden' : 'block'}`}
      onClick={() => {
        const event = new CustomEvent("sidebar:toggle");
        window.dispatchEvent(event);
      }}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  );
};

const DashboardContent = () => {
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth();
  
  // Handle auth errors (including 404 "Invalid tenant or subdomain")
  // The API utility will already handle the redirect for this specific error
  // This is just an extra safeguard
  if (authError && authError.message === "Invalid tenant or subdomain") {
    // The API utility will handle the redirect, so we can just return null
    return null;
  }

  // Show full-page loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 w-full max-w-md">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // If not authenticated, the useAuth hook will handle the redirect
  if (!isAuthenticated) {
    // Don't render anything while not authenticated
    return null;
  }

  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <main className="flex-1 p-6 pt-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300 relative">
        {/* The SidebarToggleButton is now a separate component that has access to sidebar context */}
        <SidebarToggleButton />
        
        <DashboardLayout>
          <div className="space-y-8">
            <ChurnMetrics />
            <CustomerList />
          </div>
        </DashboardLayout>
      </main>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
    return null;
  }

  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;
