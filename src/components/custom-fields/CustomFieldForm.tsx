
import React from "react";
import { Plus, Trash2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField } from "@/domain/models/customField";
import CustomFieldItem from "./CustomFieldItem";
import NoCustomFields from "./NoCustomFields";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface CustomFieldFormProps {
  fields: CustomField[];
  isLoading: boolean;
  isUpdating: boolean;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  activeCategory?: string;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  fields,
  isLoading,
  isUpdating,
  onAddField,
  onRemoveField,
  onUpdateField,
  onSubmit,
  activeCategory = "Customer"
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full dark:bg-gray-700" />
        <Skeleton className="h-32 w-full dark:bg-gray-700" />
        <Skeleton className="h-32 w-full dark:bg-gray-700" />
      </div>
    );
  }
  
  // Check if there are identifier fields in the list
  const hasIdentifierField = fields.some(field => field.isIdentifier);
  
  // Get identifier fields that are being used
  const identifierFields = fields.filter(field => field.isIdentifier);
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
        <div className="flex gap-2">
          <div className="text-sm text-amber-800 dark:text-amber-200">
            {activeCategory === "Customer" ? (
              <>
                Customer ID, Name, Email, and Phone are built-in fields. You need to mark at least one field as an identifier (
                <Link2 className="inline h-3.5 w-3.5" />) to link customers across modules.
              </>
            ) : (
              <>
                Fields in this category will be linked to customers using the identifier field you selected in the Customer category.
              </>
            )}
          </div>
        </div>
      </div>
      
      {activeCategory === "Customer" && !hasIdentifierField && fields.length > 0 && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <AlertTitle className="text-blue-800 dark:text-blue-200">
            <Link2 className="inline h-4 w-4 mr-2" />
            Please designate an identifier field
          </AlertTitle>
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            Mark at least one text or number field as an identifier to link customers across modules.
          </AlertDescription>
        </Alert>
      )}
      
      {activeCategory === "Customer" && hasIdentifierField && (
        <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <AlertTitle className="text-green-800 dark:text-green-200">
            <Link2 className="inline h-4 w-4 mr-2" />
            Identifier field configured
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            {identifierFields.length === 1 
              ? `"${identifierFields[0].label}" will be used to identify customers` 
              : `${identifierFields.length} fields will be used to identify customers`
            }
          </AlertDescription>
        </Alert>
      )}
      
      {fields.length === 0 ? (
        <NoCustomFields onAddField={onAddField} />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 px-4 pb-2 text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Field Key</div>
            <div className="col-span-3">Display Label</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Options</div>
            <div className="col-span-1"></div>
          </div>

          {fields.map((field, index) => (
            <CustomFieldItem
              key={index}
              field={field}
              index={index}
              onUpdateField={onUpdateField}
              onRemoveField={onRemoveField}
              category={activeCategory}
            />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
          <Button type="button" variant="outline" onClick={onAddField} className="gap-1 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
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
