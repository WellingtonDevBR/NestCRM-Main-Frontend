
// Custom field domain models
export interface CustomField {
  key: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  required: boolean;
  options?: string[]; // For select type fields
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
