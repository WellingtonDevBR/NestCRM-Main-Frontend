
// Custom field domain models
export interface CustomField {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  required: boolean;
  options?: string[]; // For select type fields
  uiConfig?: UIConfig; // Property for UI rendering configuration
  isIdentifier?: boolean; // New property to mark a field as an identifier
}

// UI Configuration for custom field rendering
export interface UIConfig {
  // Display types based on field type
  type?: 
    // Default for all field types
    "default" | 
    
    // Select field types
    "badge" | "pill" | "icon" | "chip" | 
    
    // Text field types
    "link" | "highlight" | "tooltip-only" | "avatar" | 
    
    // Date field types
    "date" | "time" | "calendar" | 
    
    // Number field types
    "currency" | "percent" | "progress" | "rating" | 
    
    // Boolean field types
    "boolean" | "status-dot";
    
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

// Identifier field types
export const IDENTIFIER_FIELD_TYPES = ["text", "number"];
