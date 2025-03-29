
import { useState, useEffect, useReducer } from "react";
import { toast } from "sonner";
import { 
  CustomField, 
  CustomFieldCategory,
  DEFAULT_ASSOCIATION_FIELDS
} from "@/domain/models/customField";
import { useCustomFields } from "@/hooks/useCustomFields";
import { customFieldsReducer } from "@/domain/reducers/customFieldsReducer";
import { 
  validateCustomFields, 
  validateAssociationFields,
  ensureAssociationFields,
  prepareFieldsForSaving
} from "@/domain/services/customFieldsService";

export function useCustomFieldsManager() {
  const { 
    customFieldCategories, 
    isLoadingCategories,
    updateCategoryFields,
    isUpdatingCategory
  } = useCustomFields();

  const [activeCategory, setActiveCategory] = useState("Customer");
  const [categoryFields, dispatch] = useReducer(customFieldsReducer, []);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // When customFieldCategories data is loaded or activeCategory changes, update the fields
  useEffect(() => {
    console.log("useCustomFieldsManager > customFieldCategories:", customFieldCategories);
    console.log("useCustomFieldsManager > activeCategory:", activeCategory);
    
    if (customFieldCategories?.length) {
      const category = customFieldCategories.find(c => c.category === activeCategory);
      console.log("useCustomFieldsManager > Found category data:", category);
      
      if (category) {
        // Ensure association fields are properly set up for this category before setting fields
        const fieldsWithAssociations = category.fields ? 
          ensureAssociationFields(category.fields, activeCategory) : [];
        console.log("useCustomFieldsManager > Fields with associations:", fieldsWithAssociations);
        
        dispatch({ type: 'SET_FIELDS', payload: fieldsWithAssociations });
        setInitialized(true);
      } else {
        // Initialize with default association fields if it's a Customer category
        if (activeCategory === "Customer") {
          console.log("Initializing Customer with default association fields:", DEFAULT_ASSOCIATION_FIELDS);
          dispatch({ type: 'SET_FIELDS', payload: [...DEFAULT_ASSOCIATION_FIELDS] });
        } else {
          dispatch({ type: 'SET_FIELDS', payload: [] });
        }
        setInitialized(true);
      }
    } else {
      console.log("useCustomFieldsManager > No categories data available");
      // Initialize with default association fields if it's a Customer category
      if (activeCategory === "Customer") {
        console.log("Initializing Customer with default association fields (no categories):", DEFAULT_ASSOCIATION_FIELDS);
        dispatch({ type: 'SET_FIELDS', payload: [...DEFAULT_ASSOCIATION_FIELDS] });
      } else {
        dispatch({ type: 'SET_FIELDS', payload: [] });
      }
      setInitialized(true);
    }
  }, [customFieldCategories, activeCategory]);

  // Update association fields when switching categories
  useEffect(() => {
    if (initialized && categoryFields.length > 0) {
      console.log(`Checking association fields for ${activeCategory}`, categoryFields);
      const updatedFields = ensureAssociationFields(categoryFields, activeCategory);
      
      // Only update if we actually need to change something
      if (JSON.stringify(updatedFields) !== JSON.stringify(categoryFields)) {
        console.log(`Updating association fields for ${activeCategory}`, updatedFields);
        dispatch({ type: 'SET_FIELDS', payload: updatedFields });
      }
    }
  }, [initialized, activeCategory]);

  const addField = () => {
    dispatch({ type: 'ADD_FIELD' });
  };

  const removeField = (index: number) => {
    // Don't allow removing association fields
    const field = categoryFields[index];
    if (field.isAssociationField) {
      toast.error("Association fields cannot be removed as they're required for linking modules");
      return;
    }
    
    dispatch({ type: 'REMOVE_FIELD', payload: index });
  };

  const updateField = (index: number, updates: Partial<CustomField>) => {
    console.log("Updating field", index, updates);
    dispatch({ 
      type: 'UPDATE_FIELD', 
      payload: { index, updates } 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!validateCustomFields(categoryFields)) {
      return;
    }
    
    // Validation for association fields
    if (!validateAssociationFields(categoryFields, activeCategory)) {
      return;
    }
    
    try {
      setIsUpdating(true);
      console.log(`Submitting fields for ${activeCategory}:`, categoryFields);
      
      const fieldsToSave = prepareFieldsForSaving(categoryFields);
      
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

  return {
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
}
