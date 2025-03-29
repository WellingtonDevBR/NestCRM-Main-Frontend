
import React from "react";
import { Key } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface BasicFieldControlsProps {
  field: CustomField;
  index: number;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
  category?: string;
  isSpecialAssociationField?: boolean;
}

const BasicFieldControls: React.FC<BasicFieldControlsProps> = ({
  field,
  index,
  onUpdateField,
  category = "Customer",
  isSpecialAssociationField = false
}) => {
  // Make sure we're using the correct value from the field
  const isAssociationField = field.isAssociationField === true;
  const useAsAssociation = field.useAsAssociation === true;

  return (
    <>
      <div className="col-span-3">
        <Input
          value={field.key}
          onChange={e => onUpdateField(index, { key: e.target.value })}
          placeholder="e.g., loyaltyPoints"
          className="font-mono text-sm dark:bg-gray-800 dark:border-gray-700"
          disabled={isAssociationField}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {isAssociationField ? (
            <span className="flex items-center gap-1">
              <Key className="h-3 w-3" /> Association field
            </span>
          ) : (
            "API identifier"
          )}
        </p>
      </div>
      
      <div className="col-span-3">
        <Input
          value={field.label}
          onChange={e => onUpdateField(index, { label: e.target.value })}
          placeholder="e.g., Loyalty Points"
          className="dark:bg-gray-800 dark:border-gray-700"
        />
        <p className="text-xs text-muted-foreground mt-1">Shown to users</p>
      </div>
      
      <div className="col-span-2">
        <Select
          value={field.type}
          onValueChange={value => {
            if (isAssociationField && value !== "text" && value !== "number") return;
            
            const updates: Partial<CustomField> = { 
              type: value as "text" | "date" | "number" | "select",
              ...(value === "select" && !field.options ? { options: [] } : {})
            };
            
            onUpdateField(index, updates);
          }}
          disabled={isAssociationField && category !== "Customer"}
        >
          <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="select">Select</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-3">
        <div className="flex flex-col gap-2">
          {isAssociationField ? (
            <div className="flex items-center gap-2">
              <Switch
                id={`use-association-${index}`}
                checked={useAsAssociation}
                onCheckedChange={checked => onUpdateField(index, { useAsAssociation: checked })}
              />
              <Label htmlFor={`use-association-${index}`} className="cursor-pointer">Use as association</Label>
              <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Association Field</Badge>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Switch
                id={`required-${index}`}
                checked={field.required}
                onCheckedChange={checked => onUpdateField(index, { required: checked })}
              />
              <Label htmlFor={`required-${index}`} className="cursor-pointer">Required field</Label>
            </div>
          )}
          
          {isAssociationField && category !== "Customer" && (
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-1">
                <Key className="h-3 w-3" />
                <span>Links to {category}</span>
              </Badge>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BasicFieldControls;
