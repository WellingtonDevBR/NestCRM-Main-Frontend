
import { CustomField } from "@/domain/models/customField";

export interface UIConfig {
  type?: string;
  colorMap?: Record<string, string>;
  iconMap?: Record<string, string>;
  format?: string;
  tooltip?: string;
  isAssociationField?: boolean; // Added for association fields
  useAsAssociation?: boolean;   // Added for association control
}

export interface DynamicFieldRendererProps {
  value: any;
  uiConfig?: UIConfig;
  className?: string;
}

export interface TooltipWrapperProps {
  content: React.ReactNode;
  tooltip?: string;
  className?: string;
}
