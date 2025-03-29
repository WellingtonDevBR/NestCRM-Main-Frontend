import { CustomField, DEFAULT_ASSOCIATION_FIELDS } from "@/domain/models/customField";
import { toast } from "sonner";

// Validate that all required fields have keys and labels
export const validateCustomFields = (fields: CustomField[]): boolean => {
  // Check if all fields have keys and labels
  const invalidFields = fields.filter(field => !field.key || !field.label);
  if (invalidFields.length > 0) {
    toast.error("Please fill in all field keys and labels");
    return false;
  }
  
  // Check for duplicate keys
  const keys = fields.map(field => field.key);
  const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
  if (hasDuplicates) {
    toast.error("Field keys must be unique");
    return false;
  }
  
  // Validate key format (alphanumeric and underscores only)
  const invalidKeyFormat = fields.some(field => !/^[a-zA-Z0-9_]+$/.test(field.key));
  if (invalidKeyFormat) {
    toast.error("Field keys must contain only letters, numbers, and underscores");
    return false;
  }
  
  return true;
};

// Validate association fields specifically
export const validateAssociationFields = (
  fields: CustomField[],
  category: string
): boolean => {
  // Get association fields
  const associationFields = fields.filter(field => field.isAssociationField);
  
  // Ensure at least one association field is marked for use
  const hasAssociationFieldForUse = associationFields.some(field => field.useAsAssociation);
  
  if (!hasAssociationFieldForUse) {
    // Different error messages for Customer vs other categories
    if (category === "Customer") {
      toast.error("At least one association field (Customer ID or Email) must be marked to use as association for better data integrity");
    } else {
      toast.error("At least one customer association field (Customer ID or Email) must be marked to use as association to link data to customers");
    }
    return false;
  }
  
  return true;
};

// Ensure association fields exist for a category
export const ensureAssociationFields = (
  fields: CustomField[],
  category: string
): CustomField[] => {
  const existingAssociationFields = fields.filter(field => field.isAssociationField);
  
  // If we already have all the association fields, return the original fields
  if (existingAssociationFields.length >= DEFAULT_ASSOCIATION_FIELDS.length) {
    return fields;
  }
  
  // Otherwise, add any missing association fields
  const existingKeys = new Set(existingAssociationFields.map(field => field.key));
  
  const fieldsToAdd = DEFAULT_ASSOCIATION_FIELDS
    .filter(defaultField => !existingKeys.has(defaultField.key))
    .map(defaultField => ({
      ...defaultField,
      // Initialize useAsAssociation based on category
      useAsAssociation: category !== "Customer" ? 
        defaultField.key === "customer_id" : 
        defaultField.key === "email" || defaultField.key === "customer_id"
    }));
  
  if (fieldsToAdd.length > 0) {
    return [...fieldsToAdd, ...fields];
  }
  
  return fields;
};

// Prepare fields for saving (filter out fields that shouldn't be saved)
export const prepareFieldsForSaving = (
  fields: CustomField[]
): CustomField[] => {
  // Only include fields that are explicitly defined by the user
  // For association fields, only include them if they have been explicitly set with useAsAssociation
  return fields.filter(field => {
    // Always include regular custom fields that have both key and label
    if (!field.isAssociationField && field.key && field.label) {
      return true;
    }
    
    // For association fields, only include if they have been explicitly set with useAsAssociation
    if (field.isAssociationField) {
      return field.useAsAssociation === true;
    }
    
    return false;
  });
};
