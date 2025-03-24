
import React from "react";
import { Plus, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoCustomFieldsProps {
  onAddField: () => void;
}

const NoCustomFields: React.FC<NoCustomFieldsProps> = ({ onAddField }) => {
  return (
    <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
      <Database className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
      <h3 className="text-lg font-medium mb-2">No custom fields defined yet</h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        Add custom fields to collect additional information about your customers.
      </p>
      <Button 
        type="button" 
        onClick={onAddField} 
        className="mt-2 bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Field
      </Button>
    </div>
  );
};

export default NoCustomFields;
