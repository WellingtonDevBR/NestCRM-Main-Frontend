
import React from "react";
import { DynamicFieldRendererProps } from "./types";
import { getDotColorClass } from "./colorUtils";

// Boolean renderer
export const BooleanRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Status Dot renderer
export const StatusDotRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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
