
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { storeItem } from "@/utils/localStorage";

// Local storage key for notifications
const SETTINGS_NOTIFICATIONS_KEY = "nestcrm-notifications";

export interface NotificationSettingsProps {
  notificationSettings: {
    emailNotifications: boolean;
    inAppNotifications: boolean;
    churnAlerts: boolean;
    weeklyReports: boolean;
  };
  setNotificationSettings: React.Dispatch<React.SetStateAction<{
    emailNotifications: boolean;
    inAppNotifications: boolean;
    churnAlerts: boolean;
    weeklyReports: boolean;
  }>>;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  notificationSettings, 
  setNotificationSettings 
}) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default NotificationSettings;
