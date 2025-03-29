
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
import { CustomField } from "@/domain/models/customField";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface EntityCustomFieldsSectionProps {
  customFields: CustomField[];
  form: UseFormReturn<any>;
  entityType: string;
}

const EntityCustomFieldsSection: React.FC<EntityCustomFieldsSectionProps> = ({
  customFields,
  form,
  entityType
}) => {
  if (customFields.length === 0) {
    return null;
  }

  // Filter and group fields
  const associationFields = customFields.filter(f => f.isAssociationField);
  const requiredFields = customFields.filter(f => f.required && !f.isAssociationField);
  const optionalFields = customFields.filter(f => !f.required && !f.isAssociationField);
  
  // Early return if no fields to display
  if (associationFields.length === 0 && requiredFields.length === 0 && optionalFields.length === 0) {
    return null;
  }
  
  const renderField = (field: CustomField) => {
    const isAssociationField = field.isAssociationField === true;
    const fieldName = `customFields.${field.key}`;
    
    const inputClassName = isAssociationField 
      ? "border-l-4 border-l-purple-500 pl-3" 
      : "";
    
    return (
      <FormField
        control={form.control}
        name={fieldName}
        render={({ field: formField }) => (
          <FormItem>
            <Label htmlFor={field.key} className="flex items-center">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <FormControl>
              {field.type === "select" && field.options?.length ? (
                <Select
                  value={formField.value?.toString() || ""}
                  onValueChange={formField.onChange}
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
              ) : (
                <Input
                  {...formField}
                  type={field.type === "number" ? "number" : "text"}
                  className={inputClassName}
                  id={field.key}
                />
              )}
            </FormControl>
          </FormItem>
        )}
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
              {renderField(field)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EntityCustomFieldsSection;
