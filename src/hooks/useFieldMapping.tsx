
import { useState, useEffect } from "react";
import { CustomField, CustomFieldCategory } from "@/domain/models/customField";
import { ModelFeature } from "@/domain/models/predictionMapping";
import { isFieldCompatible } from "@/domain/utils/fieldTypeUtils";

export function useFieldMapping(
  modelFeature: ModelFeature,
  customFieldCategories: CustomFieldCategory[],
  selectedField?: string
) {
  // Find the category for the selected field
  const getFieldCategory = (fieldKey: string | undefined, categories: CustomFieldCategory[]): string | undefined => {
    if (!fieldKey || !categories || !Array.isArray(categories) || fieldKey === "not_mapped") return undefined;
    
    for (const category of categories) {
      if (!category?.fields || !Array.isArray(category.fields)) continue;
      
      if (category.fields.some(field => field?.key === fieldKey)) {
        return category.category;
      }
    }
    return undefined;
  };

  // Initialize with the category that contains the selected field
  const initialCategory = getFieldCategory(selectedField, customFieldCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory);

  // Update selected category when selectedField changes
  useEffect(() => {
    // Only update if the selected field has changed and has a value
    if (selectedField && selectedField !== "not_mapped") {
      const category = getFieldCategory(selectedField, customFieldCategories);
      if (category && category !== selectedCategory) {
        setSelectedCategory(category);
      }
    }
  }, [selectedField, customFieldCategories, selectedCategory]);

  // Get all available fields from a specific category
  const getCategoryFields = (category: string | undefined): CustomField[] => {
    if (!category || !customFieldCategories || !Array.isArray(customFieldCategories)) {
      return [];
    }
    
    const categoryData = customFieldCategories.find(c => c.category === category);
    if (categoryData && Array.isArray(categoryData.fields)) {
      return categoryData.fields;
    }
    return [];
  };

  // Get fields available for the selected category
  const availableFields = getCategoryFields(selectedCategory);
  
  // Filter compatible fields based on the model field type
  const compatibleFields = availableFields.filter(field => 
    field && isFieldCompatible(field, modelFeature.modelType)
  );

  // Log for debugging
  console.log(`useFieldMapping for ${modelFeature.modelField}:`, {
    selectedCategory,
    selectedField,
    compatibleFieldsCount: compatibleFields.length
  });

  return {
    selectedCategory,
    setSelectedCategory,
    compatibleFields
  };
}
