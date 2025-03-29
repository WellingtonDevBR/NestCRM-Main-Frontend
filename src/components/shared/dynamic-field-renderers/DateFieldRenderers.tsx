
import React from "react";
import { DynamicFieldRendererProps } from "./types";

// Date formatter renderer
export const DateFormatRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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
