
import React, { useState } from "react";
import { Trash2, Plus, X, Settings2 } from "lucide-react";
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
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { CustomField, UIConfig } from "@/domain/models/customField";
import { Separator } from "@/components/ui/separator";

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
  const [colorKey, setColorKey] = useState("");
  const [colorValue, setColorValue] = useState("green");
  
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

  const updateUIConfig = (updates: Partial<UIConfig>) => {
    const currentUIConfig = field.uiConfig || {};
    onUpdateField(index, {
      uiConfig: {
        ...currentUIConfig,
        ...updates
      }
    });
  };

  const addColorMapping = () => {
    if (!colorKey.trim()) return;
    
    const currentColorMap = field.uiConfig?.colorMap || {};
    
    updateUIConfig({
      colorMap: {
        ...currentColorMap,
        [colorKey]: colorValue
      }
    });
    
    setColorKey("");
  };

  const removeColorMapping = (key: string) => {
    if (!field.uiConfig?.colorMap) return;
    
    const { [key]: _, ...restColorMap } = field.uiConfig.colorMap;
    
    updateUIConfig({
      colorMap: restColorMap
    });
  };
  
  const availableUiTypes = [
    { value: "", label: "Default" },
    { value: "badge", label: "Badge" },
    { value: "pill", label: "Pill" },
    { value: "currency", label: "Currency" },
    { value: "percent", label: "Percent" },
    { value: "rating", label: "Rating Stars" },
    { value: "boolean", label: "Boolean" }
  ];

  const availableColors = [
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "indigo", label: "Indigo" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" }
  ];
  
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
      <div className="col-span-1 flex justify-end space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">UI Display Settings</h4>
              <div className="space-y-2">
                <Label>Display Type</Label>
                <Select
                  value={field.uiConfig?.type || ""}
                  onValueChange={(value) => {
                    if (value === "") {
                      // Remove the type property
                      const { type, ...rest } = field.uiConfig || {};
                      onUpdateField(index, { uiConfig: Object.keys(rest).length ? rest : undefined });
                    } else {
                      updateUIConfig({ type: value as UIConfig["type"] });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Default" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUiTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {(field.uiConfig?.type === "badge" || field.uiConfig?.type === "pill") && field.type === "select" && (
                <div className="space-y-2">
                  <Label>Color Mappings</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Input
                      value={colorKey}
                      onChange={(e) => setColorKey(e.target.value)}
                      placeholder="Value"
                      className="text-sm flex-1"
                    />
                    <Select value={colorValue} onValueChange={setColorValue}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={addColorMapping}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="space-y-1 mt-1">
                    {field.uiConfig?.colorMap && Object.entries(field.uiConfig.colorMap).length > 0 ? (
                      Object.entries(field.uiConfig.colorMap).map(([key, color]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{key}</span>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`${getBadgeColorClass(color)}`}
                            >
                              {color}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeColorMapping(key)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">No color mappings added</p>
                    )}
                  </div>
                </div>
              )}
              
              {(field.uiConfig?.type === "currency" || field.uiConfig?.type === "percent") && field.type === "number" && (
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Input
                    value={field.uiConfig?.format || ""}
                    onChange={(e) => updateUIConfig({ format: e.target.value })}
                    placeholder="e.g., USD or EUR for currency"
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
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      
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

// Helper function to get badge color class (same as in DynamicFieldRenderer)
const getBadgeColorClass = (color: string): string => {
  switch (color.toLowerCase()) {
    case "green":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "red":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "yellow":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "blue":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "indigo":
      return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
    case "purple":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "pink":
      return "bg-pink-100 text-pink-800 hover:bg-pink-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export default CustomFieldItem;
