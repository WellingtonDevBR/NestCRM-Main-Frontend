
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar, { SidebarToggleButton } from "@/components/dashboard/DashboardSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { isOnDashboardSubdomain } from "@/utils/subdomain";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth();
  
  // Handle auth errors
  if (authError && authError.message === "Invalid tenant or subdomain") {
    return null; // API utility will handle the redirect
  }

  // Show loading state
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

  // If not authenticated, don't render
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex w-full">
      <DashboardSidebar />
      <main className="flex-1 p-6 pt-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300 ease-in-out relative">
        <SidebarToggleButton />
        {children}
      </main>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </SidebarProvider>
  );
};

export default AppLayout;
