
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

  // Ensure association fields are present in each category, including Customer
  useEffect(() => {
    // For all categories, ensure association fields exist
    const missingAssociationFields = DEFAULT_ASSOCIATION_FIELDS.filter(defaultField => 
      !categoryFields.some(field => field.key === defaultField.key)
    );
    
    if (missingAssociationFields.length > 0) {
      // Add association fields with default association state
      const updatedFields = [
        ...missingAssociationFields.map(field => ({
          ...field,
          // For non-Customer categories, make customer_id used for association by default
          // For Customer category, don't use either by default
          useAsAssociation: activeCategory !== "Customer" ? field.key === "customer_id" : false
        })),
        ...categoryFields
      ];
      
      setCategoryFields(updatedFields);
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
      
      // Send the complete payload with category and all fields
      const validFields = categoryFields.filter(field => field.key && field.label);
      await updateCategoryFields({
        category: activeCategory,
        fields: validFields
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
