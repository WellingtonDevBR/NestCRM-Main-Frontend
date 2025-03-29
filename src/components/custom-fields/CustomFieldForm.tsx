
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField, ASSOCIATION_FIELD_KEYS } from "@/domain/models/customField";
import CustomFieldItem from "./CustomFieldItem";
import NoCustomFields from "./NoCustomFields";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomFieldsContext } from "@/context/CustomFieldsContext";

interface CustomFieldFormProps {
  activeCategory?: string;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  activeCategory = "Customer"
}) => {
  const {
    categoryFields: fields,
    isLoading,
    isUpdating,
    addField,
    removeField,
    updateField,
    handleSubmit
  } = useCustomFieldsContext();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full dark:bg-gray-700" />
        <Skeleton className="h-32 w-full dark:bg-gray-700" />
        <Skeleton className="h-32 w-full dark:bg-gray-700" />
      </div>
    );
  }
  
  console.log("CustomFieldForm > All fields:", fields);
  
  // Get association fields (id and email)
  const associationFields = fields.filter(field => field.isAssociationField === true);
  console.log("CustomFieldForm > Association fields:", associationFields);
  
  // Regular custom fields (not association fields)
  const customFields = fields.filter(field => field.isAssociationField !== true);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.length === 0 ? (
        <NoCustomFields onAddField={addField} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Field Key</div>
            <div className="col-span-3">Display Label</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Options</div>
            <div className="col-span-1"></div>
          </div>
          
          {/* Association fields first for all categories */}
          {associationFields.length > 0 && associationFields.map((field, index) => {
            console.log("Rendering association field:", field);
            return (
              <CustomFieldItem
                key={`assoc-${field.key}`}
                field={field}
                index={fields.findIndex(f => f.key === field.key)}
                onUpdateField={updateField}
                onRemoveField={removeField}
                category={activeCategory}
                isAssociationField={true}
              />
            );
          })}
          
          {/* Separator between association fields and custom fields */}
          {associationFields.length > 0 && customFields.length > 0 && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t dark:border-gray-700"></span>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-2 text-xs text-muted-foreground dark:bg-gray-800">
                  Custom {activeCategory} Fields
                </span>
              </div>
            </div>
          )}

          {/* Regular custom fields */}
          {customFields.length > 0 && customFields.map((field, index) => (
            <CustomFieldItem
              key={index}
              field={field}
              index={fields.findIndex(f => f.key === field.key)}
              onUpdateField={updateField}
              onRemoveField={removeField}
              category={activeCategory}
            />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <Button type="button" variant="outline" onClick={addField} className="gap-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <Plus className="h-4 w-4" />
            Add Another Field
          </Button>
          
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700"
            disabled={isLoading || isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Field Configuration"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default CustomFieldForm;
