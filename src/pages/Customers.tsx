
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomersTable from "@/components/customers/CustomersTable";
import CustomerDialog from "@/components/customers/CustomerDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { isOnDashboardSubdomain } from "@/utils/subdomain";
import { Customer } from "@/hooks/useCustomers";

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState<Customer | null>(null);
  
  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
    return null;
  }

  // Handle auth errors
  if (authError && authError.message === "Invalid tenant or subdomain") {
    return null;
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

  const handleAddNewCustomer = () => {
    setCurrentCustomer(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 p-6 pt-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300 relative">
          {/* Floating button to show sidebar when collapsed */}
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-50 shadow-md bg-white md:hidden group-data-[state=collapsed]:block lg:group-data-[state=collapsed]:block" 
            onClick={() => {
              const event = new CustomEvent("sidebar:toggle");
              window.dispatchEvent(event);
            }}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          
          <DashboardLayout>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Customers</h1>
                  <p className="text-muted-foreground">Manage your customer data</p>
                </div>
                <Button 
                  onClick={handleAddNewCustomer}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add New Customer
                </Button>
              </div>
              
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Customer Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomersTable onEdit={handleEditCustomer} />
                </CardContent>
              </Card>
            </div>
          </DashboardLayout>
          
          <CustomerDialog 
            open={open} 
            onOpenChange={setOpen} 
            isEditMode={isEditMode}
            customer={currentCustomer}
          />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
