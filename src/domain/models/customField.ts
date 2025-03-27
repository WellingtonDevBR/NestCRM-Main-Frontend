
// Custom field domain models
export interface CustomField {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  required: boolean;
  options?: string[]; // For select type fields
  uiConfig?: UIConfig; // New property for UI rendering configuration
}

// UI Configuration for custom field rendering
export interface UIConfig {
  type?: "default" | "badge" | "pill" | "currency" | "percent" | "rating" | "boolean";
  colorMap?: Record<string, string>; // Maps values to color names (e.g., "Active": "green")
  iconMap?: Record<string, string>; // Maps values to icon names (e.g., "Active": "check-circle")
  format?: string; // For number/date formatting (e.g., "currency", "percent")
  tooltip?: string; // Optional tooltip text
}

export interface CustomFieldCategory {
  category: string;
  fields: CustomField[];
}

// Available categories in the system
export type FieldCategory = "Customer" | "Order" | "Payment" | "Interaction" | "Support";

// List of available categories for UI/UX purposes
export const FIELD_CATEGORIES: FieldCategory[] = [
  "Customer",
  "Order", 
  "Payment", 
  "Interaction", 
  "Support"
];
