
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredItem } from "@/utils/localStorage";
import SettingsHeader from "@/components/settings/SettingsHeader";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import DataPrivacySettings from "@/components/settings/DataPrivacySettings";

// Local storage keys for notifications and data privacy
const SETTINGS_NOTIFICATIONS_KEY = "nestcrm-notifications";
const SETTINGS_DATA_PRIVACY_KEY = "nestcrm-data-privacy";

const GeneralSettings = () => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Card className="overflow-hidden border-0 shadow-sm">
        <CardHeader className="border-b bg-card px-6 py-4">
          <SettingsHeader />
        </CardHeader>
        
        <CardContent className="p-6">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="data-privacy">Data & Privacy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appearance" className="space-y-4">
              <AppearanceSettings />
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4">
              <NotificationSettings 
                notificationSettings={notificationSettings}
                setNotificationSettings={setNotificationSettings}
              />
            </TabsContent>
            
            <TabsContent value="data-privacy" className="space-y-4">
              <DataPrivacySettings 
                dataPrivacySettings={dataPrivacySettings}
                setDataPrivacySettings={setDataPrivacySettings}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralSettings;
