
// Custom fields and field category models
export interface CustomField {
  key: string; // Identifier used in API
  label: string; // Display name shown to users
  type: 'text' | 'date' | 'number' | 'select';
  required?: boolean;
  options?: string[]; // For select type fields
  isAssociationField?: boolean; // Flag for fields used to associate between entities
  useAsAssociation?: boolean; // Flag to indicate if this association field should be used
  uiConfig?: UIConfig; // Configuration for UI rendering
}

export interface UIConfig {
  type: 'text' | 'badge' | 'datetime' | 'currency' | 'percentage' | 'number' | 'status';
  options?: Record<string, string>; // For mapping values to display representations
  format?: string; // For formatting values (e.g., date format)
  colorMap?: Record<string, string>; // For color mapping in badges, pills, etc.
  iconMap?: Record<string, string>; // For icon mapping
  tooltip?: string; // For tooltip information
}

export interface CustomFieldCategory {
  category: string;
  fields: CustomField[];
}

// Field categories that are available in the system
export const FIELD_CATEGORIES = [
  "Customer", 
  "Order", 
  "Payment", 
  "Interaction", 
  "Support"
];

// Field category type
export type FieldCategory = typeof FIELD_CATEGORIES[number];

// Association field keys
export const ASSOCIATION_FIELD_KEYS = {
  ID: 'id',
  EMAIL: 'email'
};

// Default values for association fields that should be present in all relevant categories
export const DEFAULT_ASSOCIATION_FIELDS: CustomField[] = [
  {
    key: ASSOCIATION_FIELD_KEYS.ID,
    label: 'Customer ID',
    type: 'text',
    required: true,
    isAssociationField: true,
    useAsAssociation: true
  },
  {
    key: ASSOCIATION_FIELD_KEYS.EMAIL,
    label: 'Email',
    type: 'text',
    required: false,
    isAssociationField: true,
    useAsAssociation: true
  }
];
