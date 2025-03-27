
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UIConfig } from "@/domain/models/customField";
import * as Icons from "lucide-react";

interface DynamicFieldRendererProps {
  value: any;
  uiConfig?: UIConfig;
  className?: string;
}

const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig,
  className = ""
}) => {
  if (value === undefined || value === null) {
    return <span className="text-muted-foreground">—</span>;
  }

  // If no uiConfig is provided, render default
  if (!uiConfig || !uiConfig.type) {
    return <span className={className}>{String(value)}</span>;
  }

  // Handle different rendering types
  switch (uiConfig.type) {
    case "badge":
      return renderBadge(value, uiConfig, className);
    case "pill":
      return renderPill(value, uiConfig, className);
    case "currency":
      return renderCurrency(value, uiConfig, className);
    case "percent":
      return renderPercent(value, uiConfig, className);
    case "rating":
      return renderRating(value, uiConfig, className);
    case "boolean":
      return renderBoolean(value, uiConfig, className);
    default:
      return <span className={className}>{String(value)}</span>;
  }
};

// Rendering functions for each uiConfig type
const renderBadge = (value: any, uiConfig: UIConfig, className: string) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const badgeClass = getBadgeColorClass(color);
  
  return (
    <Badge className={`${badgeClass} ${className}`}>
      {renderWithIcon(value, uiConfig)}
    </Badge>
  );
};

const renderPill = (value: any, uiConfig: UIConfig, className: string) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const pillClass = getPillColorClass(color);
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pillClass} ${className}`}>
      {renderWithIcon(value, uiConfig)}
    </span>
  );
};

const renderCurrency = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number') {
    return <span className={className}>{String(value)}</span>;
  }
  
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value)}
    </span>
  );
};

const renderPercent = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number') {
    return <span className={className}>{String(value)}</span>;
  }
  
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-US', { 
        style: 'percent',
        maximumFractionDigits: 2
      }).format(value / 100)}
    </span>
  );
};

const renderRating = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number' || value < 0 || value > 5) {
    return <span className={className}>{String(value)}</span>;
  }
  
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Icons.Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      ))}
      {hasHalfStar && (
        <Icons.Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <Icons.Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      ))}
    </div>
  );
};

const renderBoolean = (value: any, uiConfig: UIConfig, className: string) => {
  const isTrue = value === true || value === "true" || value === 1 || value === "1";
  
  return (
    <div className={`flex items-center ${className}`}>
      {isTrue ? (
        <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
      ) : (
        <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
      )}
      <span>{isTrue ? "Yes" : "No"}</span>
    </div>
  );
};

// Helper function to render icon if present in iconMap
const renderWithIcon = (value: any, uiConfig: UIConfig) => {
  const iconName = uiConfig.iconMap?.[value];
  
  if (!iconName) {
    return String(value);
  }
  
  // Check if the icon exists in Lucide
  // @ts-ignore - Dynamic icon lookup
  const IconComponent = Icons[iconName];
  
  if (!IconComponent) {
    return String(value);
  }
  
  return (
    <div className="flex items-center space-x-1">
      <IconComponent className="w-3 h-3" />
      <span>{String(value)}</span>
    </div>
  );
};

// Helper function to get badge color classes based on color name
const getBadgeColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "red":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "yellow":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "blue":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "indigo":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "purple":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "pink":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

// Helper function to get pill color classes
const getPillColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100 text-green-800";
    case "red":
      return "bg-red-100 text-red-800";
    case "yellow":
      return "bg-amber-100 text-amber-800";
    case "blue":
      return "bg-blue-100 text-blue-800";
    case "indigo":
      return "bg-indigo-100 text-indigo-800";
    case "purple":
      return "bg-purple-100 text-purple-800";
    case "pink":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default DynamicFieldRenderer;
