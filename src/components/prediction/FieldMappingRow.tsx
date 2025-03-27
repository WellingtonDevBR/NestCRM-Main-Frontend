
import React from "react";
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
import { CustomField } from "@/domain/models/customField";
import { FieldMapping } from "@/utils/predictionMappingApi";

interface FieldMappingRowProps {
  modelFeature: Omit<FieldMapping, 'tenantField'>;
  customFields: CustomField[];
  selectedField?: string;
  onFieldChange: (modelField: string, tenantField: string) => void;
}

const FieldMappingRow: React.FC<FieldMappingRowProps> = ({
  modelFeature,
  customFields,
  selectedField,
  onFieldChange
}) => {
  const handleChange = (value: string) => {
    onFieldChange(modelFeature.modelField, value);
  };

  // Filter custom fields by matching type if modelType is specified
  // Ensure customFields is an array before filtering
  const compatibleFields = modelFeature.modelType && Array.isArray(customFields)
    ? customFields.filter(field => {
        if (!field) return false;
        if (modelFeature.modelType === "number") return field.type === "number";
        if (modelFeature.modelType === "select") return field.type === "select";
        return true;
      })
    : customFields || [];

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center">
          <span className="font-medium">{modelFeature.modelField}</span>
          {modelFeature.description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 text-gray-400 hover:text-gray-500">
                    <HelpCircle size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{modelFeature.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </td>
      <td className="py-3 px-2">
        <Select value={selectedField} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Not mapped</SelectItem>
            {compatibleFields.map(field => (
              <SelectItem key={field.key} value={field.key}>
                {field.label} ({field.key})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>
      <td className="py-3 px-2 text-sm text-gray-500">
        {modelFeature.modelType || "any"}
      </td>
    </tr>
  );
};

export default FieldMappingRow;
