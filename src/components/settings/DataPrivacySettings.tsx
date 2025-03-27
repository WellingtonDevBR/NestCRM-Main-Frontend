
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { storeItem } from "@/utils/localStorage";

// Local storage key for data privacy
const SETTINGS_DATA_PRIVACY_KEY = "nestcrm-data-privacy";

export interface DataPrivacySettingsProps {
  dataPrivacySettings: {
    allowAnonymousData: boolean;
    showHelpTips: boolean;
  };
  setDataPrivacySettings: React.Dispatch<React.SetStateAction<{
    allowAnonymousData: boolean;
    showHelpTips: boolean;
  }>>;
}

const DataPrivacySettings: React.FC<DataPrivacySettingsProps> = ({ 
  dataPrivacySettings, 
  setDataPrivacySettings 
}) => {
  const { toast } = useToast();

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
  );
};

export default DataPrivacySettings;
