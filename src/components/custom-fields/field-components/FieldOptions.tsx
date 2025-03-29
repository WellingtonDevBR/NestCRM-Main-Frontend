
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomField } from "@/domain/models/customField";

interface FieldOptionsProps {
  field: CustomField;
  index: number;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
}

const FieldOptions: React.FC<FieldOptionsProps> = ({
  field,
  index,
  onUpdateField,
}) => {
  const [newOption, setNewOption] = useState("");

  const addOption = () => {
    if (!newOption.trim()) return;
    
    const currentOptions = field.options || [];
    if (currentOptions.includes(newOption.trim())) {
      return; // Don't add duplicates
    }
    
    onUpdateField(index, { 
      options: [...currentOptions, newOption.trim()]
    });
    setNewOption("");
  };
  
  const removeOption = (optionToRemove: string) => {
    const filteredOptions = (field.options || []).filter(
      option => option !== optionToRemove
    );
    onUpdateField(index, { options: filteredOptions });
  };

  if (field.type !== "select") {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center mb-2">
        <Input
          value={newOption}
          onChange={e => setNewOption(e.target.value)}
          placeholder="Add option"
          className="text-sm mr-2 dark:bg-gray-800 dark:border-gray-700"
          onKeyDown={e => e.key === 'Enter' && addOption()}
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={addOption}
          className="dark:bg-gray-800 dark:border-gray-700"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {(field.options || []).map((option, i) => (
          <Badge key={i} variant="secondary" className="flex items-center gap-1 dark:bg-gray-700 dark:text-gray-200">
            {option}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-3 w-3 p-0 ml-1"
              onClick={() => removeOption(option)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        {!field.options?.length && (
          <p className="text-xs text-muted-foreground">No options added yet</p>
        )}
      </div>
    </div>
  );
};

export default FieldOptions;
