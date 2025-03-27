
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

  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    getFieldCategory(selectedField, customFieldCategories)
  );

  useEffect(() => {
    // Update selected category when selectedField changes
    const category = getFieldCategory(selectedField, customFieldCategories);
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [selectedField, customFieldCategories, selectedCategory]);

  // Get all available fields from a specific category
  const getCategoryFields = (category: string | undefined): CustomField[] => {
    if (!category || !customFieldCategories || !Array.isArray(customFieldCategories)) {
      console.log(`No fields found for category: ${category}`);
      return [];
    }
    
    const categoryData = customFieldCategories.find(c => c.category === category);
    if (categoryData && categoryData.fields) {
      console.log(`Fields for category ${category}:`, categoryData.fields);
      return categoryData.fields || [];
    }
    return [];
  };

  // Get fields available for the selected category
  const availableFields = getCategoryFields(selectedCategory);
  
  // Filter compatible fields based on the model field type
  const compatibleFields = availableFields.filter(field => {
    if (!field) return false;

    // Log field types for debugging
    console.log(`Comparing field ${field.key} (${field.type}) with model type ${modelFeature.modelType}`);
    
    return isFieldCompatible(field, modelFeature.modelType);
  });
  
  console.log(`Compatible fields for ${modelFeature.modelField}:`, compatibleFields);

  return {
    selectedCategory,
    setSelectedCategory,
    compatibleFields
  };
}
