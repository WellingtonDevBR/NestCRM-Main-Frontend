
import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CustomField, UIConfig } from "@/domain/models/customField";
import { getBadgeColorClass } from "../utils/fieldItemUtils";

interface ColorMappingSectionProps {
  field: CustomField;
  updateUIConfig: (updates: Partial<UIConfig>) => void;
}

const ColorMappingSection: React.FC<ColorMappingSectionProps> = ({
  field,
  updateUIConfig
}) => {
  const [colorKey, setColorKey] = useState("");
  const [colorValue, setColorValue] = useState("green");

  const availableColors = [
    { value: "green", label: "Green" },
    { value: "red", label: "Red" },
    { value: "yellow", label: "Yellow" },
    { value: "blue", label: "Blue" },
    { value: "indigo", label: "Indigo" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" }
  ];

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

  const shouldShowColors = field.type === "select" && 
    ["badge", "pill", "chip"].includes(field.uiConfig?.type || "");
  
  if (!shouldShowColors) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Label>Color Mappings</Label>
      <div className="flex items-center gap-2 mb-2">
        <Input
          value={colorKey}
          onChange={(e) => setColorKey(e.target.value)}
          placeholder="Value"
          className="text-sm flex-1 dark:bg-gray-800 dark:border-gray-700"
        />
        <Select value={colorValue} onValueChange={setColorValue}>
          <SelectTrigger className="w-24 dark:bg-gray-800 dark:border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
          className="dark:bg-gray-800 dark:border-gray-700"
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
                  className={`${getBadgeColorClass(color as string)}`}
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
  );
};

export default ColorMappingSection;
