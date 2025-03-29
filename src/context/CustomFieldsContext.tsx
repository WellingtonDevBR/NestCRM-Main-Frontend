
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  CustomField, 
  CustomFieldCategory, 
  FIELD_CATEGORIES, 
  DEFAULT_ASSOCIATION_FIELDS
} from "@/domain/models/customField";
import { useCustomFields } from "@/hooks/useCustomFields";

interface CustomFieldsContextType {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categoryFields: CustomField[];
  isLoading: boolean;
  isUpdating: boolean;
  addField: () => void;
  removeField: (index: number) => void;
  updateField: (index: number, updates: Partial<CustomField>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

const CustomFieldsContext = createContext<CustomFieldsContextType | undefined>(undefined);

export const CustomFieldsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    customFieldCategories, 
    isLoadingCategories,
    updateCategoryFields,
    isUpdatingCategory
  } = useCustomFields();

  const [activeCategory, setActiveCategory] = useState("Customer");
  const [categoryFields, setCategoryFields] = useState<CustomField[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // When customFieldCategories data is loaded or activeCategory changes, update the fields
  useEffect(() => {
    console.log("CustomFieldsContext > customFieldCategories:", customFieldCategories);
    console.log("CustomFieldsContext > activeCategory:", activeCategory);
    
    if (customFieldCategories?.length) {
      const category = customFieldCategories.find(c => c.category === activeCategory);
      console.log("CustomFieldsContext > Found category data:", category);
      
      if (category) {
        setCategoryFields(category.fields || []);
      } else {
        setCategoryFields([]);
      }
    } else {
      console.log("CustomFieldsContext > No categories data available");
      setCategoryFields([]);
    }
  }, [customFieldCategories, activeCategory]);

  // Ensure association fields are present in each category
  useEffect(() => {
    // For all categories, ensure association fields exist
    const existingAssociationFields = categoryFields.filter(field => field.isAssociationField);
    
    // If no association fields exist or they're incomplete, add the default ones
    if (existingAssociationFields.length < DEFAULT_ASSOCIATION_FIELDS.length) {
      const existingKeys = new Set(existingAssociationFields.map(field => field.key));
      
      // Add any missing association fields
      const fieldsToAdd = DEFAULT_ASSOCIATION_FIELDS
        .filter(defaultField => !existingKeys.has(defaultField.key))
        .map(defaultField => ({
          ...defaultField,
          // Initialize useAsAssociation based on category
          // For Customer category, use realistic defaults
          // For other categories, customer_id is usually the primary association
          useAsAssociation: activeCategory !== "Customer" ? 
            defaultField.key === "customer_id" : 
            defaultField.key === "email" || defaultField.key === "customer_id"
        }));
      
      if (fieldsToAdd.length > 0) {
        setCategoryFields([...fieldsToAdd, ...categoryFields]);
      }
    }
  }, [activeCategory, categoryFields]);

  const addField = () => {
    setCategoryFields([
      ...categoryFields,
      { key: "", label: "", type: "text", required: false }
    ]);
  };

  const removeField = (index: number) => {
    // Don't allow removing association fields
    const field = categoryFields[index];
    if (field.isAssociationField) {
      toast.error("Association fields cannot be removed as they're required for linking modules");
      return;
    }
    
    setCategoryFields(categoryFields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    setCategoryFields(categoryFields.map((field, i) => 
      i === index ? { ...field, ...updates } : field
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const invalidFields = categoryFields.filter(field => !field.key || !field.label);
    if (invalidFields.length > 0) {
      toast.error("Please fill in all field keys and labels");
      return;
    }
    
    // Check for duplicate keys
    const keys = categoryFields.map(field => field.key);
    const hasDuplicates = keys.some((key, index) => keys.indexOf(key) !== index);
    if (hasDuplicates) {
      toast.error("Field keys must be unique");
      return;
    }
    
    // Validate key format (alphanumeric and underscores only)
    const invalidKeyFormat = categoryFields.some(field => !/^[a-zA-Z0-9_]+$/.test(field.key));
    if (invalidKeyFormat) {
      toast.error("Field keys must contain only letters, numbers, and underscores");
      return;
    }
    
    // Validation for association fields
    const associationFields = categoryFields.filter(field => field.isAssociationField);
    
    // For ALL categories (including Customer), ensure at least one association field is marked for use
    const hasAssociationFieldForUse = associationFields.some(field => field.useAsAssociation);
    
    if (!hasAssociationFieldForUse) {
      // Different error messages for Customer vs other categories
      if (activeCategory === "Customer") {
        toast.error("At least one association field (Customer ID or Email) must be marked to use as association for better data integrity");
      } else {
        toast.error("At least one customer association field (Customer ID or Email) must be marked to use as association to link data to customers");
      }
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log(`Submitting fields for ${activeCategory}:`, categoryFields);
      
      // Only include fields that are explicitly defined by the user
      // For association fields, only include them if they have been explicitly set with useAsAssociation
      const fieldsToSave = categoryFields.filter(field => {
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
      
      // Ensure we're including at least one association field
      const includesAssociationField = fieldsToSave.some(field => field.isAssociationField && field.useAsAssociation);
      
      if (!includesAssociationField) {
        // Add the first association field that's marked for use
        const defaultAssociationField = categoryFields.find(field => field.isAssociationField && field.useAsAssociation);
        if (defaultAssociationField) {
          fieldsToSave.push(defaultAssociationField);
        }
      }
      
      console.log(`Fields to save for ${activeCategory}:`, fieldsToSave);
      
      await updateCategoryFields({
        category: activeCategory,
        fields: fieldsToSave
      });
      
      toast.success(`${activeCategory} fields updated successfully`);
    } catch (error) {
      console.error("Error updating fields:", error);
      toast.error(`Failed to update ${activeCategory} fields`);
    } finally {
      setIsUpdating(false);
    }
  };

  const value = {
    activeCategory,
    setActiveCategory,
    categoryFields,
    isLoading: isLoadingCategories,
    isUpdating: isUpdating || isUpdatingCategory,
    addField,
    removeField,
    updateField,
    handleSubmit
  };

  return (
    <CustomFieldsContext.Provider value={value}>
      {children}
    </CustomFieldsContext.Provider>
  );
};

export const useCustomFieldsContext = () => {
  const context = useContext(CustomFieldsContext);
  if (context === undefined) {
    throw new Error("useCustomFieldsContext must be used within a CustomFieldsProvider");
  }
  return context;
};
