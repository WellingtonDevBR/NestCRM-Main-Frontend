
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
  let fieldsToAdd: CustomField[] = [];
  
  // Go through each DEFAULT_ASSOCIATION_FIELD
  DEFAULT_ASSOCIATION_FIELDS.forEach(defaultField => {
    if (!existingKeys.has(defaultField.key)) {
      // Field doesn't exist, add it with sensible defaults
      let newField: CustomField = {
        ...defaultField,
        // For non-Customer categories, default customer_id to true
        // For Customer category, we don't set any defaults so user must choose
        useAsAssociation: 
          category !== "Customer" ? defaultField.key === "customer_id" : false
      };
      fieldsToAdd.push(newField);
    } else {
      // Field exists, preserve its current state
      const existingField = existingFieldMap[defaultField.key];
      
      // If the field exists but doesn't have useAsAssociation set (undefined),
      // set a default value based on category and field key
      if (existingField.useAsAssociation === undefined) {
        existingField.useAsAssociation = 
          category !== "Customer" ? defaultField.key === "customer_id" : false;
      }
    }
  });
  
  // For existing association fields, respect their current configuration
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
