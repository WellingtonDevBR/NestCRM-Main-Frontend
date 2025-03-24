
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-6 pt-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
          <DashboardLayout>
            <div className="space-y-8">
              <ChurnMetrics />
              <CustomerList />
            </div>
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
