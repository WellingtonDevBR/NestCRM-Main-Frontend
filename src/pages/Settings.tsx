
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { PanelLeft, User, Sliders, Database, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const settingsCategories = [
    {
      title: "Profile Settings",
      description: "Manage your profile information and account details",
      icon: User,
      path: "/api/settings/profile",
      disabled: true,
    },
    {
      title: "Customer Data Fields",
      description: "Customize what information you collect about your customers",
      icon: Database,
      path: "/api/settings/custom-fields",
      disabled: false,
    },
    {
      title: "General Settings",
      description: "Configure general system preferences and appearance",
      icon: Sliders,
      path: "/api/settings/general",
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

          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-purple-600" />
                <h1 className="text-3xl font-bold">Settings</h1>
              </div>
              <p className="text-muted-foreground mt-1">Configure your application settings and preferences</p>
              <Separator className="mt-6" />
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {settingsCategories.map((category, index) => (
                <Card key={index} className={`overflow-hidden transition-all duration-200 hover:shadow-md ${category.disabled ? "opacity-70" : ""}`}>
                  <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-purple-600"></div>
                  </div>
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 rounded-md bg-purple-100">
                      <category.icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 mt-2"
                      disabled={category.disabled}
                      asChild={!category.disabled}
                    >
                      {!category.disabled ? (
                        <Link to={category.path}>Configure</Link>
                      ) : (
                        <span>Coming Soon</span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
