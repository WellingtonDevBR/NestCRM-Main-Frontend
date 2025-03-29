
import React from "react";
import { PanelLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { CustomFieldsProvider } from "@/context/CustomFieldsContext";

// Import the refactored components
import CustomFieldsHeader from "@/components/custom-fields/CustomFieldsHeader";
import CategoryTabs from "@/components/custom-fields/CategoryTabs";

const CustomFields = () => {
  return (
    <CustomFieldsProvider>
      <SidebarProvider>
        <div className="min-h-screen flex">
          <DashboardSidebar />
          <main className="flex-1 p-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
            <Button 
              variant="outline" 
              size="icon"
              className="fixed top-4 left-4 z-50 shadow-md bg-background border-border dark:bg-gray-800 dark:border-gray-700 md:hidden" 
              onClick={() => {
                window.dispatchEvent(new CustomEvent("sidebar:toggle"));
              }}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>

            <div className="max-w-4xl mx-auto space-y-8 pt-6">
              <CustomFieldsHeader />
              
              <Alert className="dark:bg-gray-800 dark:border-gray-700">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Configure the custom fields for each module in the system. For Customer category, mark at least one field as an identifier.
                  For other modules, a Customer ID or Email field will be automatically included to link data to customers.
                </AlertDescription>
              </Alert>
              
              <CategoryTabs />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </CustomFieldsProvider>
  );
};

export default CustomFields;
