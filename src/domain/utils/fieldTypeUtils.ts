
import { CustomField } from "@/domain/models/customField";
import { ModelFeature } from "@/domain/models/predictionMapping";

/**
 * Checks if a custom field is compatible with a model feature based on their types
 */
export const isFieldCompatible = (
  field: CustomField, 
  modelType?: string
): boolean => {
  if (!field || !modelType) return true;
  
  // For number type model fields, match with number type custom fields
  if (modelType === "number" && field.type === "number") {
    return true;
  }
  
  // For select type model fields, match with select type custom fields or fields with options
  if (modelType === "select" && (field.type === "select" || (field.options && field.options.length > 0))) {
    return true;
  }
  
  // For any type or undefined type, accept any field
  if (!modelType || modelType === "any") {
    return true;
  }
  
  return false;
};

/**
 * Get the appropriate color class for a type badge
 */
export const getTypeColor = (type?: string): string => {
  switch (type) {
    case "number": return "bg-blue-100 text-blue-700";
    case "select": return "bg-purple-100 text-purple-700";
    default: return "bg-gray-100 text-gray-700";
  }
};
