
import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField } from "@/domain/models/customField";
import BasicFieldControls from "./field-components/BasicFieldControls";
import FieldOptions from "./field-components/FieldOptions";
import UIConfigPopover from "./field-components/UIConfigPopover";
import { validateFieldUIType } from "./utils/fieldItemUtils";

interface CustomFieldItemProps {
  field: CustomField;
  index: number;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
  onRemoveField: (index: number) => void;
  category?: string;
  isAssociationField?: boolean;
}

const CustomFieldItem: React.FC<CustomFieldItemProps> = ({
  field,
  index,
  onUpdateField,
  onRemoveField,
  category = "Customer",
  isAssociationField = false
}) => {
  // Ensure UI type is valid when field type changes
  useEffect(() => {
    if (field.uiConfig?.type) {
      const validatedField = validateFieldUIType(field);
      if (validatedField !== field) {
        onUpdateField(index, validatedField);
      }
    }
  }, [field.type]);
  
  // Determine if this is a special association field (id or email)
  const isSpecialAssociationField = field.isAssociationField === true;

  // Debug logs for field states
  useEffect(() => {
    console.log(`Field in ${category}: ${field.key}`, { 
      isAssociationField: field.isAssociationField,
      useAsAssociation: field.useAsAssociation 
    });
  }, [field, category]);
  
  return (
    <div className={`grid grid-cols-12 gap-4 items-center p-4 border rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:border-purple-200 dark:hover:border-purple-700 transition-colors ${
      isSpecialAssociationField ? "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10" : ""
    }`}>
      <BasicFieldControls 
        field={field}
        index={index}
        onUpdateField={onUpdateField}
        category={category}
        isSpecialAssociationField={isSpecialAssociationField}
      />
      
      <div className="col-span-1 flex justify-end space-x-2">
        {!isSpecialAssociationField && (
          <UIConfigPopover
            field={field}
            index={index}
            onUpdateField={onUpdateField}
          />
        )}
      
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveField(index)}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
          disabled={isSpecialAssociationField}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Options for select field type */}
      {!isSpecialAssociationField && field.type === "select" && (
        <div className="col-span-12">
          <FieldOptions
            field={field}
            index={index}
            onUpdateField={onUpdateField}
          />
        </div>
      )}
    </div>
  );
};

export default CustomFieldItem;
