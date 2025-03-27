
import React from "react";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoCustomFieldsProps {
  onAddField: () => void;
}

const NoCustomFields: React.FC<NoCustomFieldsProps> = ({ onAddField }) => {
  return (
    <div className="text-center p-8 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-full">
          <FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />
        </div>
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-200">No custom fields</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Get started by creating a new custom field.
      </p>
      <div className="mt-6">
        <Button 
          onClick={onAddField}
          className="gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Add First Field
        </Button>
      </div>
    </div>
  );
};

export default NoCustomFields;
