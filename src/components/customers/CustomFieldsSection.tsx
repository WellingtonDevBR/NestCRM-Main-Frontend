
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
  isEditMode?: boolean;
}

const CustomFieldsSection: React.FC<CustomFieldsSectionProps> = ({
  customFields,
  formData,
  onFieldChange,
  isEditMode = false
}) => {
  if (customFields.length === 0) {
    return null;
  }

  // Filter and group fields
  const associationFields = customFields.filter(f => 
    f.isAssociationField && (isEditMode || f.useAsAssociation === true)
  );
  const requiredFields = customFields.filter(f => f.required && !f.isAssociationField);
  const optionalFields = customFields.filter(f => !f.required && !f.isAssociationField);
  
  // Early return if no fields to display
  if (associationFields.length === 0 && requiredFields.length === 0 && optionalFields.length === 0) {
    return null;
  }
  
  const renderField = (field: CustomField) => {
    // Use field.key (API identifier) to get the value, not the label
    const value = formData.customFields[field.key] ?? "";
    const isAssociationField = field.isAssociationField === true;
    
    const inputClassName = isAssociationField 
      ? "border-l-4 border-l-purple-500 pl-3" 
      : "";
    
    if (field.type === "select" && field.options?.length) {
      return (
        <Select
          value={value.toString()}
          onValueChange={newValue => onFieldChange(field, newValue)}
        >
          <SelectTrigger className={inputClassName}>
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
    
    const fieldProps = getFieldProps(field, value, onFieldChange);
    
    return (
      <Input 
        {...fieldProps}
        className={inputClassName}
      />
    );
  };
  
  return (
    <div className="space-y-4">
      {/* Association fields first with purple styling */}
      {associationFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">ASSOCIATION FIELDS</h3>
          {associationFields.map(field => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="flex items-center">
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
      
      {/* Required custom fields */}
      {requiredFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">REQUIRED FIELDS</h3>
          {requiredFields.map(field => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key} className="flex items-center">
                {field.label}
                <span className="text-destructive ml-1">*</span>
              </Label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
      
      {/* Optional custom fields */}
      {optionalFields.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">OPTIONAL FIELDS</h3>
          {optionalFields.map(field => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFieldsSection;
