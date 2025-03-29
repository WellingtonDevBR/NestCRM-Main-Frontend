
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DynamicFieldRendererProps } from "./types";
import { getHighlightClass } from "./colorUtils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Link renderer
export const LinkRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Highlight renderer
export const HighlightRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
  const color = uiConfig.colorMap?.[value] || "yellow";
  const highlightClass = getHighlightClass(color);
  
  return (
    <span className={`${highlightClass} px-1 rounded ${className}`}>
      {String(value)}
    </span>
  );
};

// Tooltip-only renderer
export const TooltipOnlyRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Avatar renderer
export const AvatarRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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
