
import { CustomField, UIConfig } from "@/domain/models/customField";

// Get UI type options based on field type
export const getUiTypeOptions = (fieldType: string) => {
  switch (fieldType) {
    case "select":
      return [
        { value: "default", label: "Default" },
        { value: "badge", label: "Badge" },
        { value: "pill", label: "Pill" },
        { value: "icon", label: "Icon" },
        { value: "chip", label: "Chip" }
      ];
    case "text":
      return [
        { value: "default", label: "Default" },
        { value: "link", label: "Link" },
        { value: "highlight", label: "Highlight" },
        { value: "tooltip-only", label: "Tooltip Only" },
        { value: "avatar", label: "Avatar" }
      ];
    case "date":
      return [
        { value: "default", label: "Default" },
        { value: "date", label: "Date" },
        { value: "time", label: "Time" },
        { value: "calendar", label: "Calendar" }
      ];
    case "number":
      return [
        { value: "default", label: "Default" },
        { value: "currency", label: "Currency" },
        { value: "percent", label: "Percent" },
        { value: "progress", label: "Progress Bar" },
        { value: "rating", label: "Rating Stars" }
      ];
    default:
      return [
        { value: "default", label: "Default" },
        { value: "boolean", label: "Boolean" },
        { value: "status-dot", label: "Status Dot" }
      ];
  }
};

// Get color classes for badges
export const getBadgeColorClass = (color: string): string => {
  if (!color) return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  
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

// Ensure UI type is valid for the field type
export const validateFieldUIType = (field: CustomField): Partial<CustomField> => {
  if (!field || !field.uiConfig?.type || !field.type) return field;
  
  const validOptions = getUiTypeOptions(field.type).map(option => option.value);
  
  if (!validOptions.includes(field.uiConfig.type)) {
    // If current UI type is not valid for the field type, reset to default
    const { uiConfig, ...restField } = field;
    const { type, ...restConfig } = uiConfig || {};
    
    return { 
      ...restField,
      uiConfig: Object.keys(restConfig).length ? { type: 'text', ...restConfig } : undefined
    };
  }
  
  return field;
};
