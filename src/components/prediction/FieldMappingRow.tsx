
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CustomFieldCategory } from "@/domain/models/customField";
import { ModelFeature } from "@/domain/models/predictionMapping";
import { getTypeColor } from "@/domain/utils/fieldTypeUtils";
import { useFieldMapping } from "@/hooks/useFieldMapping";
import FieldDescription from "./FieldDescription";
import CategorySelector from "./CategorySelector";
import FieldSelector from "./FieldSelector";

interface FieldMappingRowProps {
  modelFeature: ModelFeature;
  customFieldCategories: CustomFieldCategory[];
  selectedField?: string;
  selectedCategory?: string;
  onFieldChange: (modelField: string, tenantField: string, category: string) => void;
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({
  modelFeature,
  customFieldCategories,
  selectedField,
  selectedCategory,
  onFieldChange
}) => {
  console.log(`FieldMappingRow for ${modelFeature.modelField} - selectedField:`, selectedField, "selectedCategory:", selectedCategory);
  
  const { 
    selectedCategory: localSelectedCategory, 
    setSelectedCategory, 
    compatibleFields 
  } = useFieldMapping(modelFeature, customFieldCategories, selectedField);

  // Initialize from props if provided
  useEffect(() => {
    if (selectedCategory && selectedCategory !== localSelectedCategory) {
      setSelectedCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Only reset field selection if we actually had a category change
    if (category !== localSelectedCategory) {
      onFieldChange(modelFeature.modelField, "not_mapped", category);
    }
  };

  const handleFieldChange = (value: string) => {
    onFieldChange(modelFeature.modelField, value, localSelectedCategory || "");
  };

  // Field selector should be disabled only when no category is selected
  const isFieldSelectorDisabled = !localSelectedCategory;

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center">
          <span className="font-medium">{modelFeature.modelField.replace(/_/g, ' ')}</span>
          <FieldDescription description={modelFeature.description} />
        </div>
      </td>
      <td className="py-3 px-2">
        <CategorySelector
          selectedCategory={localSelectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </td>
      <td className="py-3 px-2">
        <FieldSelector
          selectedField={selectedField}
          compatibleFields={compatibleFields}
          disabled={isFieldSelectorDisabled}
          onFieldChange={handleFieldChange}
        />
      </td>
      <td className="py-3 px-2 text-sm">
        <Badge variant="outline" className={`font-normal ${getTypeColor(modelFeature.modelType)}`}>
          {modelFeature.modelType || "any"}
        </Badge>
      </td>
    </tr>
  );
};

export default FieldMappingRow;
