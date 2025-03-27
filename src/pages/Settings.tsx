
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Database, Settings as SettingsIcon, TrendingUp, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const settingsCategories = [
    {
      title: "General Settings",
      description: "Configure system preferences, themes, and notifications",
      icon: Sliders,
      path: "/settings/general",
      disabled: false,
    },
    {
      title: "Custom Data Fields",
      description: "Customize what information you collect across different modules",
      icon: Database,
      path: "/settings/custom-fields",
      disabled: false,
    },
    {
      title: "Churn Prediction Field Mapping",
      description: "Map your custom fields to our churn prediction model features",
      icon: TrendingUp,
      path: "/settings/prediction-mapping",
      disabled: false,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <SettingsIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your application settings and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {settingsCategories.map((category, index) => (
          <Card 
            key={index} 
            className="overflow-hidden transition-all duration-200 hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800"
          >
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-600 dark:bg-purple-500"></div>
            </div>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 rounded-md bg-purple-100 dark:bg-purple-900/30 shrink-0">
                <category.icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{category.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700 mt-2 font-medium" 
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
