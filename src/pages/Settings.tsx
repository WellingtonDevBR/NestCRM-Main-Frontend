
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User, Sliders, Database, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

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
      title: "Custom Data Fields",
      description: "Customize what information you collect across different modules",
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
  );
};

export default Settings;
