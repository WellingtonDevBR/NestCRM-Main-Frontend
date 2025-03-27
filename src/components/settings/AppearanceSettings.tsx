
import React from "react";
import { Button } from "@/components/ui/button";
import { Moon, Monitor, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/components/ui/use-toast";

const AppearanceSettings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Handle theme change
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    
    toast({
      title: "Theme preference saved",
      description: `Your theme is now set to ${newTheme}.`,
    });
  };

  return (
    <div className="rounded-lg border p-4 dark:border-gray-800">
      <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
      <div className="grid grid-cols-3 gap-4">
        <Button 
          onClick={() => handleThemeChange("light")}
          variant={theme === "light" ? "default" : "outline"}
          className={theme === "light" ? "bg-purple-600 hover:bg-purple-700" : "dark:text-gray-300 dark:border-gray-700"}
        >
          <Sun className="h-4 w-4 mr-2" />
          Light
        </Button>
        <Button 
          onClick={() => handleThemeChange("dark")}
          variant={theme === "dark" ? "default" : "outline"}
          className={theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : "dark:text-gray-300 dark:border-gray-700"}
        >
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </Button>
        <Button 
          onClick={() => handleThemeChange("system")}
          variant={theme === "system" ? "default" : "outline"}
          className={theme === "system" ? "bg-purple-600 hover:bg-purple-700" : "dark:text-gray-300 dark:border-gray-700"}
        >
          <Monitor className="h-4 w-4 mr-2" />
          System
        </Button>
      </div>
    </div>
  );
};

export default AppearanceSettings;
