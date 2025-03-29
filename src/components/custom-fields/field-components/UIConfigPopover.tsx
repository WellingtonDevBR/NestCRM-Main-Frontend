
import React from "react";
import { Settings2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { CustomField, UIConfig } from "@/domain/models/customField";
import ColorMappingSection from "./ColorMappingSection";
import { getUiTypeOptions } from "../utils/fieldItemUtils";

interface UIConfigPopoverProps {
  field: CustomField;
  index: number;
  onUpdateField: (index: number, updates: Partial<CustomField>) => void;
}

const UIConfigPopover: React.FC<UIConfigPopoverProps> = ({
  field,
  index,
  onUpdateField
}) => {
  const updateUIConfig = (updates: Partial<UIConfig>) => {
    const currentUIConfig = field.uiConfig || { type: 'text' };
    onUpdateField(index, {
      uiConfig: {
        ...currentUIConfig,
        ...updates
      }
    });
  };

  // Get available UI type options
  const availableUiTypes = getUiTypeOptions(field.type);

  // Validate and update UI type
  const validateAndUpdateUiType = (value: string) => {
    const validOptions = getUiTypeOptions(field.type).map(option => option.value);
    
    if (value === "default") {
      // Remove the type property
      const { type, ...rest } = field.uiConfig || { type: 'text' };
      onUpdateField(index, { uiConfig: Object.keys(rest).length ? { type: 'text', ...rest } : undefined });
    } else if (validOptions.includes(value)) {
      updateUIConfig({ type: value as UIConfig["type"] });
    } else {
      // If current UI type is not valid for the field type, reset to default
      const { type, ...rest } = field.uiConfig || { type: 'text' };
      onUpdateField(index, { uiConfig: Object.keys(rest).length ? { type: 'text', ...rest } : undefined });
    }
  };

  // Check if we need currency/percent format section
  const showFormatField = field.type === "number" && 
    ["currency", "percent"].includes(field.uiConfig?.type || "");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-primary hover:bg-primary/10 dark:hover:bg-gray-700"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 dark:bg-gray-800 dark:border-gray-700">
        <div className="space-y-4">
          <h4 className="font-medium">UI Display Settings</h4>
          <div className="space-y-2">
            <Label>Display Type</Label>
            <Select
              value={field.uiConfig?.type || "default"}
              onValueChange={validateAndUpdateUiType}
            >
              <SelectTrigger className="dark:bg-gray-800 dark:border-gray-700">
                <SelectValue placeholder="Default" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {availableUiTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <ColorMappingSection field={field} updateUIConfig={updateUIConfig} />
          
          {showFormatField && (
            <div className="space-y-2">
              <Label>Format</Label>
              <Input
                value={field.uiConfig?.format || ""}
                onChange={(e) => updateUIConfig({ format: e.target.value })}
                placeholder="e.g., USD or EUR for currency"
                className="dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Tooltip</Label>
            <Textarea
              value={field.uiConfig?.tooltip || ""}
              onChange={(e) => updateUIConfig({ tooltip: e.target.value })}
              placeholder="Helpful information about this field"
              rows={2}
              className="dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UIConfigPopover;
