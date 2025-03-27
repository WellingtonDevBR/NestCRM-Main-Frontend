
import React from "react";
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
  onFieldChange: (modelField: string, tenantField: string) => void;
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({
  modelFeature,
  customFieldCategories,
  selectedField,
  onFieldChange
}) => {
  console.log(`FieldMappingRow - ${modelFeature.modelField} - selectedField:`, selectedField);
  
  const { 
    selectedCategory, 
    setSelectedCategory, 
    compatibleFields 
  } = useFieldMapping(modelFeature, customFieldCategories, selectedField);

  const handleCategoryChange = (category: string) => {
    console.log(`${modelFeature.modelField} - Category changed to:`, category);
    setSelectedCategory(category);
    // Reset field selection when category changes
    onFieldChange(modelFeature.modelField, "not_mapped");
  };

  const handleFieldChange = (value: string) => {
    console.log(`${modelFeature.modelField} - Field changed to:`, value);
    onFieldChange(modelFeature.modelField, value);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center">
          <span className="font-medium">{modelFeature.modelField.replace(/_/g, ' ')}</span>
          <FieldDescription description={modelFeature.description} />
        </div>
      </td>
      <td className="py-3 px-2">
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </td>
      <td className="py-3 px-2">
        <FieldSelector
          selectedField={selectedField}
          compatibleFields={compatibleFields}
          disabled={!selectedCategory}
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
