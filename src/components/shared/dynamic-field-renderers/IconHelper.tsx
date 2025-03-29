
import React from "react";
import * as Icons from "lucide-react";
import { UIConfig } from "./types";

interface IconHelperProps {
  value: any;
  uiConfig: UIConfig;
}

// Helper function to render icon if present in iconMap
export const IconHelper: React.FC<IconHelperProps> = ({ value, uiConfig }) => {
  const iconName = uiConfig.iconMap?.[value];
  
  if (!iconName) {
    return <>{String(value)}</>;
  }
  
  // Check if the icon exists in Lucide
  // @ts-ignore - Dynamic icon lookup
  const IconComponent = Icons[iconName];
  
  if (!IconComponent) {
    return <>{String(value)}</>;
  }
  
  return (
    <div className="flex items-center space-x-1">
      <IconComponent className="w-3 h-3" />
      <span>{String(value)}</span>
    </div>
  );
};
