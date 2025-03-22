
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If not on a subdomain, redirect to login
    // In a real app, you'd also check authentication status
    if (!isOnDashboardSubdomain()) {
      navigate("/login");
    }
  }, [navigate]);

  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
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
