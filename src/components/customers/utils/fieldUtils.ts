
import { CustomField } from "@/domain/models/customField";

/**
 * Process a field value based on its type
 * @param field The custom field
 * @param value The input value
 * @returns The processed value appropriate for the field type
 */
export const processFieldValue = (field: CustomField, value: string) => {
  if (field.type === "number") {
    if (value === "") return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  
  if (field.type === "date") {
    // This performs a basic validation, ensuring the value is a valid date string
    const date = new Date(value);
    return isNaN(date.getTime()) ? "" : value;
  }

  // For text and select, just return the string value
  return value;
};

/**
 * Get appropriate props for an Input component based on field type
 * @param field The custom field 
 * @param value The current value
 * @param onChange The change handler function
 * @returns Props for the Input component
 */
export const getFieldProps = (
  field: CustomField,
  value: any,
  onChange: (field: CustomField, value: string) => void
) => {
  const baseProps = {
    id: field.key,
    name: field.key,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange(field, e.target.value)
  };

  switch (field.type) {
    case "number":
      return {
        ...baseProps,
        type: "number",
        value: value === null ? "" : value,
        step: "any",
      };
    case "date":
      return {
        ...baseProps,
        type: "date",
        value: value || "",
      };
    case "select":
      // This shouldn't be rendered for select fields, but included for type safety
      return {
        ...baseProps,
        value: value || "",
      };
    default: // text
      return {
        ...baseProps,
        type: "text",
        value: value || "",
      };
  }
};
