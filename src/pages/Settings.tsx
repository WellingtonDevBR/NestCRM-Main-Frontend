
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PanelLeft, User, Sliders, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Settings = () => {
  const settingsCategories = [
    {
      title: "Profile Settings",
      description: "Manage your profile information and account details",
      icon: User,
      path: "/settings/profile",
      disabled: true,
    },
    {
      title: "Customer Custom Fields",
      description: "Configure custom fields for your customer records",
      icon: Database,
      path: "/settings/custom-fields",
      disabled: false,
    },
    {
      title: "General Settings",
      description: "Configure general system preferences and appearance",
      icon: Sliders,
      path: "/settings/general",
      disabled: true,
    },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-[var(--sidebar-width-icon)] lg:ml-0 transition-all duration-300">
          <Button 
            variant="outline" 
            size="icon"
            className="fixed top-4 left-4 z-50 shadow-md bg-white md:hidden" 
            onClick={() => {
              window.dispatchEvent(new CustomEvent("sidebar:toggle"));
            }}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

          <DashboardLayout>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your application settings and preferences</p>
              </div>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {settingsCategories.map((category, index) => (
                  <Card key={index} className={category.disabled ? "opacity-70" : ""}>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="p-2 rounded-md bg-purple-100">
                        <category.icon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700" 
                        disabled={category.disabled}
                        asChild={!category.disabled}
                      >
                        {!category.disabled ? (
                          <Link to={category.path}>Manage</Link>
                        ) : (
                          <span>Coming Soon</span>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DashboardLayout>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
