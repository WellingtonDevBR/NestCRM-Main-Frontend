
import { toast } from "sonner";
import { 
  CustomField, 
  CustomFieldCategory,
  DEFAULT_ASSOCIATION_FIELDS,
  ASSOCIATION_FIELD_KEYS
} from "@/domain/models/customField";

// Validate custom fields before saving
export const validateCustomFields = (fields: CustomField[]): boolean => {
  // Check for duplicate keys
  const keys = fields.map(field => field.key);
  const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
  
  if (hasDuplicates) {
    toast.error("Each field key must be unique");
    return false;
  }
  
  // Check for empty keys or labels
  const hasEmptyKey = fields.some(field => !field.key.trim());
  const hasEmptyLabel = fields.some(field => !field.label.trim());
  
  if (hasEmptyKey || hasEmptyLabel) {
    toast.error("Field keys and labels cannot be empty");
    return false;
  }
  
  return true;
};

// Validate association fields for the category
export const validateAssociationFields = (fields: CustomField[], category: string): boolean => {
  if (category === "Customer") {
    // For Customer category, we need at least one association field marked for use
    const associationFields = fields.filter(field => field.isAssociationField);
    const hasAssociationForUse = associationFields.some(field => field.useAsAssociation);
    
    if (!hasAssociationForUse) {
      toast.error("At least one association field (ID or Email) must be marked for use");
      return false;
    }
  }
  
  return true;
};

// Ensure that a category has all the required association fields
export const ensureAssociationFields = (fields: CustomField[], category: string): CustomField[] => {
  // Make a copy of the fields
  const updatedFields = [...fields];
  
  // Only non-Customer categories need association fields
  if (category !== "Customer") {
    // Check if we have ID field
    const hasIdField = updatedFields.some(field => 
      field.key === ASSOCIATION_FIELD_KEYS.ID && field.isAssociationField);
    
    // Check if we have Email field
    const hasEmailField = updatedFields.some(field => 
      field.key === ASSOCIATION_FIELD_KEYS.EMAIL && field.isAssociationField);
    
    // Add ID field if missing
    if (!hasIdField) {
      updatedFields.unshift({
        ...DEFAULT_ASSOCIATION_FIELDS[0],
        label: 'Customer ID'  // Set appropriate label
      });
    }
    
    // Add Email field if missing
    if (!hasEmailField) {
      updatedFields.unshift({
        ...DEFAULT_ASSOCIATION_FIELDS[1],
        label: 'Email'  // Set appropriate label
      });
    }
  }
  
  return updatedFields;
};

// Prepare fields for saving to API (adjust as needed)
export const prepareFieldsForSaving = (fields: CustomField[]): CustomField[] => {
  return fields.map(field => ({
    key: field.key,
    label: field.label,
    type: field.type,
    required: field.required || false,
    options: field.type === 'select' ? field.options : undefined,
    isAssociationField: field.isAssociationField,
    useAsAssociation: field.useAsAssociation,
    uiConfig: field.uiConfig
  }));
};
