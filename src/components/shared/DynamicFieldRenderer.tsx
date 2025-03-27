
import React from "react";
import { Badge } from "@/components/ui/badge";
import { UIConfig } from "@/domain/models/customField";
import * as Icons from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // If no uiConfig is provided, or type is not specified, render default
  if (!uiConfig || !uiConfig.type) {
    return <span className={className}>{String(value)}</span>;
  }

  // Apply tooltip wrapper if tooltip is provided
  const renderWithTooltip = (content: React.ReactNode) => {
    if (uiConfig.tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help">{content}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{uiConfig.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
    return content;
  };

  // Handle different rendering types
  switch (uiConfig.type) {
    // Select field types
    case "badge":
      return renderWithTooltip(renderBadge(value, uiConfig, className));
    case "pill":
      return renderWithTooltip(renderPill(value, uiConfig, className));
    case "icon":
      return renderWithTooltip(renderIcon(value, uiConfig, className));
    case "chip":
      return renderWithTooltip(renderChip(value, uiConfig, className));
    
    // Text field types
    case "link":
      return renderWithTooltip(renderLink(value, uiConfig, className));
    case "highlight":
      return renderWithTooltip(renderHighlight(value, uiConfig, className));
    case "tooltip-only":
      return renderTooltipOnly(value, uiConfig, className);
    case "avatar":
      return renderWithTooltip(renderAvatar(value, uiConfig, className));
    
    // Date field types
    case "date":
    case "time":
    case "calendar":
      return renderWithTooltip(renderDateFormat(value, uiConfig, className));
    
    // Number field types
    case "currency":
      return renderWithTooltip(renderCurrency(value, uiConfig, className));
    case "percent":
      return renderWithTooltip(renderPercent(value, uiConfig, className));
    case "progress":
      return renderWithTooltip(renderProgress(value, uiConfig, className));
    case "rating":
      return renderWithTooltip(renderRating(value, uiConfig, className));
    
    // Boolean field types
    case "boolean":
      return renderWithTooltip(renderBoolean(value, uiConfig, className));
    case "status-dot":
      return renderWithTooltip(renderStatusDot(value, uiConfig, className));
    
    default:
      return <span className={className}>{String(value)}</span>;
  }
};

// Rendering functions for each uiConfig type
// Select field renderers
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

const renderIcon = (value: any, uiConfig: UIConfig, className: string) => {
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

const renderChip = (value: any, uiConfig: UIConfig, className: string) => {
  const color = uiConfig.colorMap?.[value] || "default";
  const chipClass = getChipColorClass(color);
  
  return (
    <span className={`inline-block px-2 py-1 text-xs rounded ${chipClass} ${className}`}>
      {String(value)}
    </span>
  );
};

// Text field renderers
const renderLink = (value: any, uiConfig: UIConfig, className: string) => {
  return (
    <a 
      href={value.startsWith('http') ? value : `https://${value}`} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`text-blue-600 hover:underline ${className}`}
    >
      {String(value)}
    </a>
  );
};

const renderHighlight = (value: any, uiConfig: UIConfig, className: string) => {
  const color = uiConfig.colorMap?.[value] || "yellow";
  const highlightClass = getHighlightClass(color);
  
  return (
    <span className={`${highlightClass} px-1 rounded ${className}`}>
      {String(value)}
    </span>
  );
};

const renderTooltipOnly = (value: any, uiConfig: UIConfig, className: string) => {
  if (!uiConfig.tooltip) {
    return <span className={className}>{String(value)}</span>;
  }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help border-b border-dotted border-gray-400 ${className}`}>
          {String(value)}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{uiConfig.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const renderAvatar = (value: any, uiConfig: UIConfig, className: string) => {
  // Use first letter(s) for the fallback
  const initials = String(value)
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
    
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Avatar className="h-6 w-6">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <span>{String(value)}</span>
    </div>
  );
};

// Date field renderers
const renderDateFormat = (value: any, uiConfig: UIConfig, className: string) => {
  try {
    const date = new Date(value);
    
    if (isNaN(date.getTime())) {
      return <span className={className}>{String(value)}</span>;
    }
    
    let formattedDate = '';
    
    switch (uiConfig.type) {
      case 'date':
        formattedDate = date.toLocaleDateString();
        break;
      case 'time':
        formattedDate = date.toLocaleTimeString();
        break;
      case 'calendar':
        formattedDate = date.toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        break;
      default:
        formattedDate = date.toLocaleString();
    }
    
    return <span className={className}>{formattedDate}</span>;
  } catch (error) {
    return <span className={className}>{String(value)}</span>;
  }
};

// Number field renderers
const renderCurrency = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return <span className={className}>{String(value)}</span>;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return <span className={className}>{String(value)}</span>;
  }
  
  const currency = uiConfig.format || 'USD';
  
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: currency
      }).format(numValue)}
    </span>
  );
};

const renderPercent = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return <span className={className}>{String(value)}</span>;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return <span className={className}>{String(value)}</span>;
  }
  
  // Determine if the value is already in percent (0-100) or decimal (0-1)
  const percentValue = numValue > 0 && numValue < 1 ? numValue * 100 : numValue;
  
  return (
    <span className={className}>
      {new Intl.NumberFormat('en-US', { 
        style: 'percent',
        maximumFractionDigits: 2
      }).format(percentValue / 100)}
    </span>
  );
};

const renderProgress = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return <span className={className}>{String(value)}</span>;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return <span className={className}>{String(value)}</span>;
  }
  
  // Determine if the value is already in percent (0-100) or decimal (0-1)
  const percentValue = numValue > 0 && numValue < 1 ? numValue * 100 : numValue;
  
  // Ensure value is between 0 and 100
  const progressValue = Math.max(0, Math.min(100, percentValue));
  
  return (
    <div className={`w-full space-y-1 ${className}`}>
      <Progress value={progressValue} className="h-2" />
      <p className="text-xs text-right text-muted-foreground">{progressValue.toFixed(1)}%</p>
    </div>
  );
};

const renderRating = (value: any, uiConfig: UIConfig, className: string) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    return <span className={className}>{String(value)}</span>;
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue) || numValue < 0 || numValue > 5) {
    return <span className={className}>{String(value)}</span>;
  }
  
  const fullStars = Math.floor(numValue);
  const hasHalfStar = numValue % 1 >= 0.5;
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

// Boolean field renderers
const renderBoolean = (value: any, uiConfig: UIConfig, className: string) => {
  const isTrue = value === true || value === "true" || value === 1 || value === "1" || value === "yes" || value === "Yes";
  
  return (
    <div className={`flex items-center ${className}`}>
      {isTrue ? (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span>Yes</span>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          <span>No</span>
        </div>
      )}
    </div>
  );
};

const renderStatusDot = (value: any, uiConfig: UIConfig, className: string) => {
  const isTrue = value === true || value === "true" || value === 1 || value === "1" || value === "yes" || value === "Yes";
  const color = isTrue ? "green" : "red";
  
  // If there's a color map and the value is in it, use that color instead
  const mappedColor = uiConfig.colorMap?.[String(value)];
  const finalColor = mappedColor || color;
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`w-3 h-3 rounded-full ${getDotColorClass(finalColor)}`}></div>
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

// Helper function to get chip color classes
const getChipColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-500 text-white";
    case "red":
      return "bg-red-500 text-white";
    case "yellow":
      return "bg-amber-500 text-white";
    case "blue":
      return "bg-blue-500 text-white";
    case "indigo":
      return "bg-indigo-500 text-white";
    case "purple":
      return "bg-purple-500 text-white";
    case "pink":
      return "bg-pink-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

// Helper function to get text color class
const getTextColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "text-green-600";
    case "red":
      return "text-red-600";
    case "yellow":
      return "text-amber-600";
    case "blue":
      return "text-blue-600";
    case "indigo":
      return "text-indigo-600";
    case "purple":
      return "text-purple-600";
    case "pink":
      return "text-pink-600";
    default:
      return "text-gray-600";
  }
};

// Helper function to get highlight color class
const getHighlightClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100";
    case "red":
      return "bg-red-100";
    case "yellow":
      return "bg-amber-100";
    case "blue":
      return "bg-blue-100";
    case "indigo":
      return "bg-indigo-100";
    case "purple":
      return "bg-purple-100";
    case "pink":
      return "bg-pink-100";
    default:
      return "bg-yellow-100";
  }
};

// Helper function to get dot color class
const getDotColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-500";
    case "red":
      return "bg-red-500";
    case "yellow":
      return "bg-amber-500";
    case "blue":
      return "bg-blue-500";
    case "indigo":
      return "bg-indigo-500";
    case "purple":
      return "bg-purple-500";
    case "pink":
      return "bg-pink-500";
    default:
      return "bg-gray-500";
  }
};

export default DynamicFieldRenderer;
