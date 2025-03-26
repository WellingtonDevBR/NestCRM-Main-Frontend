
import React, { useState } from "react";
import { Trash2, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CustomField } from "@/domain/models/customField";

interface CustomFieldItemProps {
  field: CustomField;
  index: number;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
  onRemoveField: (index: number) => void;
}

const CustomFieldItem: React.FC<CustomFieldItemProps> = ({
  field,
  index,
  onUpdateField,
  onRemoveField,
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
  
  return (
    <div className="grid grid-cols-12 gap-4 items-center p-4 border rounded-lg bg-white shadow-sm hover:border-purple-200 transition-colors">
      <div className="col-span-3">
        <Input
          value={field.key}
          onChange={e => onUpdateField(index, { key: e.target.value })}
          placeholder="e.g., loyaltyPoints"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">API identifier</p>
      </div>
      <div className="col-span-3">
        <Input
          value={field.label}
          onChange={e => onUpdateField(index, { label: e.target.value })}
          placeholder="e.g., Loyalty Points"
        />
        <p className="text-xs text-muted-foreground mt-1">Shown to users</p>
      </div>
      <div className="col-span-2">
        <Select
          value={field.type}
          onValueChange={value => onUpdateField(index, { 
            type: value as "text" | "date" | "number" | "select",
            // Initialize options array if selecting "select" type
            ...(value === "select" && !field.options ? { options: [] } : {})
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="select">Select</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-3">
        <div className="flex items-center gap-2 mb-2">
          <Switch
            id={`required-${index}`}
            checked={field.required}
            onCheckedChange={checked => onUpdateField(index, { required: checked })}
          />
          <Label htmlFor={`required-${index}`} className="cursor-pointer">Required field</Label>
        </div>
        
        {field.type === "select" && (
          <div className="mt-2">
            <div className="flex items-center mb-2">
              <Input
                value={newOption}
                onChange={e => setNewOption(e.target.value)}
                placeholder="Add option"
                className="text-sm mr-2"
                onKeyDown={e => e.key === 'Enter' && addOption()}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-1">
              {(field.options || []).map((option, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
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
        )}
      </div>
      <div className="col-span-1 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemoveField(index)}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CustomFieldItem;
