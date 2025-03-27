
import React, { useState } from "react";
import { Sliders, ArrowLeft, Bell, Moon, Monitor, Sun } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { storeItem, getStoredItem } from "@/utils/localStorage";
import { useTheme } from "@/context/ThemeContext";

// Local storage keys for notifications and data privacy
const SETTINGS_NOTIFICATIONS_KEY = "nestcrm-notifications";
const SETTINGS_DATA_PRIVACY_KEY = "nestcrm-data-privacy";

const GeneralSettings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  // Load settings from localStorage with defaults
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: getStoredItem(`${SETTINGS_NOTIFICATIONS_KEY}-email`, true),
    inAppNotifications: getStoredItem(`${SETTINGS_NOTIFICATIONS_KEY}-inapp`, true),
    churnAlerts: getStoredItem(`${SETTINGS_NOTIFICATIONS_KEY}-churn`, true),
    weeklyReports: getStoredItem(`${SETTINGS_NOTIFICATIONS_KEY}-weekly`, true),
  });
  const [dataPrivacySettings, setDataPrivacySettings] = useState({
    allowAnonymousData: getStoredItem(`${SETTINGS_DATA_PRIVACY_KEY}-anonymous`, true),
    showHelpTips: getStoredItem(`${SETTINGS_DATA_PRIVACY_KEY}-helptips`, true),
  });

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    
    toast({
      title: "Theme preference saved",
      description: `Your theme is now set to ${newTheme}.`,
    });
  };

  // Toggle notification settings
  const toggleNotification = (key) => {
    setNotificationSettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      storeItem(`${SETTINGS_NOTIFICATIONS_KEY}-${key}`, updated[key]);
      return updated;
    });
    
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  // Toggle data privacy settings
  const toggleDataPrivacy = (key) => {
    setDataPrivacySettings(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      storeItem(`${SETTINGS_DATA_PRIVACY_KEY}-${key}`, updated[key]);
      return updated;
    });
    
    toast({
      title: "Data privacy settings updated",
      description: "Your data privacy preferences have been saved.",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardHeader className="border-b bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" asChild>
                <Link to="/settings">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Sliders className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">General Settings</CardTitle>
                  <CardDescription>Configure system preferences and appearance</CardDescription>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="data-privacy">Data & Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button 
                    onClick={() => handleThemeChange("light")}
                    variant={theme === "light" ? "default" : "outline"}
                    className={theme === "light" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button 
                    onClick={() => handleThemeChange("dark")}
                    variant={theme === "dark" ? "default" : "outline"}
                    className={theme === "dark" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button 
                    onClick={() => handleThemeChange("system")}
                    variant={theme === "system" ? "default" : "outline"}
                    className={theme === "system" ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive email alerts about important updates</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => toggleNotification("emailNotifications")} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">In-App Notifications</Label>
                      <p className="text-sm text-muted-foreground">Show notifications within the dashboard</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.inAppNotifications} 
                      onCheckedChange={() => toggleNotification("inAppNotifications")} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Churn Risk Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified when customers are at risk of churning</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.churnAlerts} 
                      onCheckedChange={() => toggleNotification("churnAlerts")} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Summary Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly analytics and insights via email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.weeklyReports} 
                      onCheckedChange={() => toggleNotification("weeklyReports")} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="data-privacy" className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium mb-4">Data & Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Anonymous Usage Data</Label>
                      <p className="text-sm text-muted-foreground">Allow sharing of anonymous usage data to improve the platform</p>
                    </div>
                    <Switch 
                      checked={dataPrivacySettings.allowAnonymousData} 
                      onCheckedChange={() => toggleDataPrivacy("allowAnonymousData")} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Help & Tips</Label>
                      <p className="text-sm text-muted-foreground">Show contextual help tips throughout the application</p>
                    </div>
                    <Switch 
                      checked={dataPrivacySettings.showHelpTips} 
                      onCheckedChange={() => toggleDataPrivacy("showHelpTips")} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
