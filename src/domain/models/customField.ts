
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
}

export interface CustomFieldCategory {
  category: string;
  fields: CustomField[];
}

// Default association fields that should be included in each category
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
