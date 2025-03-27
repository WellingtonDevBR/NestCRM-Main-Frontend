
import React, { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomField, CustomFieldCategory, FIELD_CATEGORIES } from "@/domain/models/customField";
import { FieldMapping } from "@/utils/predictionMappingApi";
import { Badge } from "@/components/ui/badge";

interface FieldMappingRowProps {
  modelFeature: Omit<FieldMapping, 'tenantField'>;
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
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    getFieldCategory(selectedField, customFieldCategories)
  );

  useEffect(() => {
    // Update selected category when selectedField changes
    const category = getFieldCategory(selectedField, customFieldCategories);
    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }
  }, [selectedField, customFieldCategories]);

  // Function to find the category for a given field key
  function getFieldCategory(fieldKey: string | undefined, categories: CustomFieldCategory[]): string | undefined {
    if (!fieldKey || !categories || !Array.isArray(categories) || fieldKey === "not_mapped") return undefined;
    
    for (const category of categories) {
      if (!category?.fields || !Array.isArray(category.fields)) continue;
      
      if (category.fields.some(field => field?.key === fieldKey)) {
        return category.category;
      }
    }
    return undefined;
  }

  // Get fields from the selected category
  const getCategoryFields = (category: string | undefined): CustomField[] => {
    if (!category || !customFieldCategories || !Array.isArray(customFieldCategories)) return [];
    
    const categoryData = customFieldCategories.find(c => c.category === category);
    return categoryData?.fields || [];
  };

  // Fields available for the selected category
  const availableFields = getCategoryFields(selectedCategory);
  
  // Filter compatible fields by matching type if modelType is specified
  const compatibleFields = modelFeature.modelType && Array.isArray(availableFields)
    ? availableFields.filter(field => {
        if (!field) return false;
        if (modelFeature.modelType === "number") return field.type === "number";
        if (modelFeature.modelType === "select") return field.type === "select";
        return true;
      })
    : availableFields || [];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Clear the field selection when category changes
    onFieldChange(modelFeature.modelField, "not_mapped");
  };

  const handleFieldChange = (value: string) => {
    onFieldChange(modelFeature.modelField, value);
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "number": return "bg-blue-100 text-blue-700";
      case "select": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center">
          <span className="font-medium">{modelFeature.modelField.replace(/_/g, ' ')}</span>
          {modelFeature.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 text-sm">
                  <p>{modelFeature.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
      <td className="py-3 px-2">
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {FIELD_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-2">
        <Select 
          value={selectedField} 
          onValueChange={handleFieldChange}
          disabled={!selectedCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={selectedCategory ? "Select a field" : "Select category first"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_mapped">Not mapped</SelectItem>
            {compatibleFields.map(field => (
              <SelectItem key={field.key} value={field.key}>
                {field.label} ({field.key})
              </SelectItem>
            ))}
            {compatibleFields.length === 0 && selectedCategory && (
              <div className="p-2 text-sm text-center text-gray-500">
                No compatible fields found in this category
              </div>
            )}
          </SelectContent>
        </Select>
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
