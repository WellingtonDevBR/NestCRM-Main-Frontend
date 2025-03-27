
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CustomField } from "@/domain/models/customField";

interface FieldSelectorProps {
  selectedField?: string;
  compatibleFields: CustomField[];
  disabled?: boolean;
  onFieldChange: (field: string) => void;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  selectedField,
  compatibleFields,
  disabled = false,
  onFieldChange
}) => {
  // Make sure we have a valid selectedField value
  const safeSelectedField = selectedField || "not_mapped";
  
  return (
    <Select 
      value={safeSelectedField} 
      onValueChange={onFieldChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={disabled ? "Select category first" : "Select a field"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="not_mapped">Not mapped</SelectItem>
        {compatibleFields && compatibleFields.length > 0 ? (
          compatibleFields.map(field => (
            <SelectItem key={field.key} value={field.key}>
              {field.label} ({field.key})
            </SelectItem>
          ))
        ) : !disabled ? (
          <div className="p-2 text-sm text-center text-gray-500">
            No compatible fields found in this category
          </div>
        ) : null}
      </SelectContent>
    </Select>
  );
};

export default FieldSelector;
