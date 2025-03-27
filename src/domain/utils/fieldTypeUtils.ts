
import { CustomField } from "../models/customField";

/**
 * Get color classes based on field type
 */
export const getTypeColor = (type?: string): string => {
  switch (type?.toLowerCase()) {
    case 'number':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'string':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'select':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'date':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'boolean':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

/**
 * Check if a custom field is compatible with the model field type
 */
export const isFieldCompatible = (customField: CustomField, modelType?: string): boolean => {
  if (!modelType || !customField || !customField.type) return true; // If no type is specified, all fields are compatible
  
  const customFieldType = customField.type?.toLowerCase();
  const modelTypeNormalized = modelType.toLowerCase();
  
  // Log for debugging
  console.log(`Checking compatibility: ${customFieldType} with ${modelTypeNormalized}`);
  
  // Direct type matching
  if (customFieldType === modelTypeNormalized) {
    return true;
  }
  
  // Special compatibility rules
  switch (modelTypeNormalized) {
    case 'number':
      return customFieldType === 'number';
    case 'string':
      return customFieldType === 'text' || customFieldType === 'string' || customFieldType === 'textarea';
    case 'select':
      return customFieldType === 'select' || customFieldType === 'boolean' || customFieldType === 'radio';
    case 'boolean':
      return customFieldType === 'boolean' || customFieldType === 'checkbox' || customFieldType === 'select';
    case 'date':
      return customFieldType === 'date';
    default:
      return true; // Unknown types are considered compatible
  }
};
