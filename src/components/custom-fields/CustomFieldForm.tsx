
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomField } from "@/domain/models/customField";
import CustomFieldItem from "./CustomFieldItem";
import NoCustomFields from "./NoCustomFields";

interface CustomFieldFormProps {
  fields: CustomField[];
  isLoading: boolean;
  isUpdating: boolean;
  onAddField: () => void;
  onRemoveField: (index: number) => void;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const CustomFieldForm: React.FC<CustomFieldFormProps> = ({
  fields,
  isLoading,
  isUpdating,
  onAddField,
  onRemoveField,
  onUpdateField,
  onSubmit,
}) => {
  console.log("CustomFieldForm rendering with fields:", fields);
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 mb-4">
        <div className="flex gap-2">
          <div className="text-sm text-amber-800">
            Customer ID, Name, Email, and Phone are built-in fields and don't need to be added here.
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center p-8">
          <p>Loading custom fields...</p>
        </div>
      ) : fields.length === 0 ? (
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
            />
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <Button type="button" variant="outline" onClick={onAddField} className="gap-1">
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
