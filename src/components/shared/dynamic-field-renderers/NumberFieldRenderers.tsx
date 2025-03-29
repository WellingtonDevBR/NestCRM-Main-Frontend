
import React from "react";
import { Progress } from "@/components/ui/progress";
import { DynamicFieldRendererProps } from "./types";
import * as Icons from "lucide-react";

// Currency renderer
export const CurrencyRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Percent renderer
export const PercentRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Progress renderer
export const ProgressRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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

// Rating renderer
export const RatingRenderer: React.FC<DynamicFieldRendererProps> = ({ 
  value, 
  uiConfig = {}, 
  className = "" 
}) => {
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
