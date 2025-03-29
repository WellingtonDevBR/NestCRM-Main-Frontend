
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

// Ensure BOTH association fields exist for all categories
export const ensureAssociationFields = (
  fields: CustomField[],
  category: string
): CustomField[] => {
  // Check existing association fields
  const existingAssociationFields = fields.filter(field => field.isAssociationField);
  const existingKeys = new Set(existingAssociationFields.map(field => field.key));
  
  // Create a map of existing association fields by key for easy lookup
  const existingFieldMap = existingAssociationFields.reduce((map, field) => {
    map[field.key] = field;
    return map;
  }, {} as Record<string, CustomField>);
  
  // Always make sure BOTH customer_id and email association fields exist
  const fieldsToAdd = DEFAULT_ASSOCIATION_FIELDS
    .filter(defaultField => !existingKeys.has(defaultField.key))
    .map(defaultField => {
      // For new fields we're adding, use the default initialization
      return {
        ...defaultField,
        // Default: customer_id is always true for non-Customer categories
        // For Customer category, follow the default setup based on what makes sense for the app
        useAsAssociation: defaultField.key === "customer_id" && category !== "Customer"
      };
    });
  
  // For existing association fields, respect their current configuration
  // and don't override their useAsAssociation value
  
  if (fieldsToAdd.length > 0) {
    return [...fieldsToAdd, ...fields];
  }
  
  return fields;
};

// Prepare fields for saving (filter out fields that shouldn't be saved)
export const prepareFieldsForSaving = (
  fields: CustomField[]
): CustomField[] => {
  // Return all fields including all association fields
  // This ensures we don't lose any association field configuration
  return fields.map(field => {
    // Ensure association fields have the correct properties
    if (field.isAssociationField) {
      return {
        ...field,
        useAsAssociation: field.useAsAssociation === true
      };
    }
    return field;
  });
};
