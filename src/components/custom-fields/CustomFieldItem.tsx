
import React from "react";
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomField } from "@/types/customer";

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
          onValueChange={value => onUpdateField(index, { type: value as "text" | "date" | "number" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="number">Number</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-3 flex items-center gap-2">
        <Switch
          id={`required-${index}`}
          checked={field.required}
          onCheckedChange={checked => onUpdateField(index, { required: checked })}
        />
        <Label htmlFor={`required-${index}`} className="cursor-pointer">Required field</Label>
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
