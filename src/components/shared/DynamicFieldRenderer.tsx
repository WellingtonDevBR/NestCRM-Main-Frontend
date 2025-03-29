import React from "react";
import TooltipWrapper from "./dynamic-field-renderers/TooltipWrapper";
import { DynamicFieldRendererProps } from "./dynamic-field-renderers/types";
import * as Icons from "lucide-react"; // Keep this for IconRenderer

// Import all field renderers
import { BadgeRenderer, PillRenderer, IconRenderer, ChipRenderer } from "./dynamic-field-renderers/SelectFieldRenderers";
import { LinkRenderer, HighlightRenderer, TooltipOnlyRenderer, AvatarRenderer } from "./dynamic-field-renderers/TextFieldRenderers";
import { DateFormatRenderer } from "./dynamic-field-renderers/DateFieldRenderers";
import { CurrencyRenderer, PercentRenderer, ProgressRenderer, RatingRenderer } from "./dynamic-field-renderers/NumberFieldRenderers";
import { BooleanRenderer, StatusDotRenderer } from "./dynamic-field-renderers/BooleanFieldRenderers";

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

  // Handle different rendering types
  let renderedContent: React.ReactNode;

  switch (uiConfig.type) {
    // Select field types
    case "badge":
      renderedContent = <BadgeRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "pill":
      renderedContent = <PillRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "icon":
      renderedContent = <IconRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "chip":
      renderedContent = <ChipRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    
    // Text field types
    case "link":
      renderedContent = <LinkRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "highlight":
      renderedContent = <HighlightRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "tooltip-only":
      renderedContent = <TooltipOnlyRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "avatar":
      renderedContent = <AvatarRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    
    // Date field types
    case "date":
    case "time":
    case "calendar":
      renderedContent = <DateFormatRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    
    // Number field types
    case "currency":
      renderedContent = <CurrencyRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "percent":
      renderedContent = <PercentRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "progress":
      renderedContent = <ProgressRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "rating":
      renderedContent = <RatingRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    
    // Boolean field types
    case "boolean":
      renderedContent = <BooleanRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    case "status-dot":
      renderedContent = <StatusDotRenderer value={value} uiConfig={uiConfig} className={className} />;
      break;
    
    default:
      renderedContent = <span className={className}>{String(value)}</span>;
  }

  // Apply tooltip wrapper if tooltip is provided
  return (
    <TooltipWrapper content={renderedContent} tooltip={uiConfig.tooltip} />
  );
};

export default DynamicFieldRenderer;
