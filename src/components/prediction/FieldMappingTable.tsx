
import React from "react";
import { AlertTriangle, HelpCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CustomField, CustomFieldCategory } from "@/domain/models/customField";
import FieldMappingRow from "./FieldMappingRow";
import { FieldMapping } from "@/utils/predictionMappingApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldMappingTableProps {
  title: string;
  features: Omit<FieldMapping, 'tenantField'>[];
  customFieldCategories: CustomFieldCategory[];
  getMappedField: (modelField: string) => string | undefined;
  onFieldChange: (modelField: string, tenantField: string) => void;
}

const FieldMappingTable: React.FC<FieldMappingTableProps> = ({
  title,
  features,
  customFieldCategories,
  getMappedField,
  onFieldChange
}) => {
  // Count how many fields are not mapped
  const unmappedCount = features.filter(f => {
    const mapping = getMappedField(f.modelField);
    return !mapping || mapping === "not_mapped";
  }).length;
  
  // Ensure customFieldCategories is an array
  const safeCustomFieldCategories = Array.isArray(customFieldCategories) ? customFieldCategories : [];
  
  return (
    <div className="space-y-4 animate-slide-up">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-400 hover:text-gray-500">
                <HelpCircle size={16} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              <p>These features are used by the prediction model. Match each one to your custom fields.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      {unmappedCount > 0 && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border border-red-200 py-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {unmappedCount} field{unmappedCount > 1 ? 's are' : ' is'} not mapped. 
            The prediction model may not work correctly without all fields mapped.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 pl-4 pr-2 text-left text-sm font-medium text-gray-500">Model Feature</th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Category</th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Mapped Field</th>
              <th className="py-3 px-2 text-left text-sm font-medium text-gray-500">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {features.map(feature => (
              <FieldMappingRow
                key={feature.modelField}
                modelFeature={feature}
                customFieldCategories={safeCustomFieldCategories}
                selectedField={getMappedField(feature.modelField)}
                onFieldChange={onFieldChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FieldMappingTable;
