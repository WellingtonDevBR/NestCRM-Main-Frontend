
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
import { useDashboardData } from "@/hooks/useDashboardData";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { isError: dashboardError } = useDashboardData();
  
  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
    return null;
  }

  // Handle dashboard data error (but don't redirect)
  React.useEffect(() => {
    if (dashboardError) {
      toast.error("Unable to load dashboard data. Please try refreshing the page.");
    }
  }, [dashboardError]);

  // Show loading state
  if (authLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DashboardSidebar />
          <main className="flex-1 p-6 pt-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
            <div className="h-full w-full flex items-center justify-center">
              <Card className="p-6 w-full max-w-md text-center">
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-purple-100 rounded-md mx-auto w-3/4"></div>
                  <div className="h-8 bg-purple-50 rounded-md mx-auto w-1/2"></div>
                  <div className="h-24 bg-purple-50 rounded-md"></div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
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
