
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UIConfig, DynamicFieldRendererProps } from "./types";
import { 
  getBadgeColorClass, 
  getPillColorClass, 
  getChipColorClass, 
  getTextColorClass 
} from "./colorUtils";
import { IconHelper } from "./IconHelper";

// Badge renderer
export const BadgeRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const badgeClass = getBadgeColorClass(color);
  
  return (
    <Badge className={`${badgeClass} ${className}`}>
      {uiConfig.iconMap ? <IconHelper value={value} uiConfig={uiConfig} /> : String(value)}
    </Badge>
  );
};

// Pill renderer
export const PillRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const pillClass = getPillColorClass(color);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pillClass} ${className}`}>
      {uiConfig.iconMap ? <IconHelper value={value} uiConfig={uiConfig} /> : String(value)}
    </span>
  );
};

// Icon renderer
export const IconRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
  // Use iconMap to determine which icon to show
  const iconName = uiConfig.iconMap?.[value];
  
  if (!iconName) {
    return <span className={className}>{String(value)}</span>;
  }
  
  // @ts-ignore - Dynamic icon lookup
  const IconComponent = Icons[iconName];
  
  if (!IconComponent) {
    return <span className={className}>{String(value)}</span>;
  }
  
  const color = uiConfig.colorMap?.[value] || "default";
  const colorClass = getTextColorClass(color);
  
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <IconComponent className={`w-4 h-4 ${colorClass}`} />
      <span>{String(value)}</span>
    </div>
  );
};

// Chip renderer
export const ChipRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const chipClass = getChipColorClass(color);
  
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${chipClass} ${className}`}>
      {String(value)}
    </span>
  );
};
