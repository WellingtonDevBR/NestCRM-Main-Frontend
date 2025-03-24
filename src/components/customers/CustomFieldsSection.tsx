
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CustomField, CustomerFormData } from "@/domain/models/customer";
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
  
  return (
    <>
      <Separator />
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground">ADDITIONAL INFORMATION</h3>
        
        {/* Required custom fields */}
        {requiredFields.map(field => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center">
              {field.label}
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Input 
              {...getFieldProps(
                field, 
                formData.customFields[field.key] ?? "", 
                onFieldChange
              )} 
            />
          </div>
        ))}
        
        {/* Optional custom fields */}
        {optionalFields.map(field => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key}>{field.label}</Label>
            <Input 
              {...getFieldProps(
                field, 
                formData.customFields[field.key] ?? "", 
                onFieldChange
              )} 
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomFieldsSection;
