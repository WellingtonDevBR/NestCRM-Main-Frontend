
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { CustomerFormData } from "@/domain/models/customer";
import { CustomField } from "@/domain/models/customField";
import { getFieldProps } from "./utils/fieldUtils";

interface CustomFieldsSectionProps {
  customFields: CustomField[];
  formData: CustomerFormData;
  onFieldChange: (field: CustomField, value: string) => void;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFields,
  formData,
  onFieldChange
}) => {
  if (customFields.length === 0) {
    return null;
  }

  // Group fields by whether they're required or not
  const requiredFields = customFields.filter(f => f.required);
  const optionalFields = customFields.filter(f => !f.required);
  
  const renderField = (field: CustomField) => {
    const value = formData.customFields[field.label] ?? "";
    
    if (field.type === "select" && field.options?.length) {
      return (
        <Select
          value={value.toString()}
          onValueChange={newValue => onFieldChange(field, newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    return (
      <Input 
        {...getFieldProps(field, value, onFieldChange)} 
      />
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Required custom fields */}
      {requiredFields.map(field => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key} className="flex items-center">
            {field.label}
            <span className="text-destructive ml-1">*</span>
          </Label>
          {renderField(field)}
        </div>
      ))}
      
      {/* Optional custom fields */}
      {optionalFields.map(field => (
        <div key={field.key} className="space-y-2">
          <Label htmlFor={field.key}>{field.label}</Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
};

export default CustomFieldsSection;
