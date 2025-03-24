
import { CustomField } from "@/domain/models/customer";

export const processFieldValue = (field: CustomField, value: string) => {
  if (field.type === 'number') {
    // Convert to number if possible, otherwise return null
    if (value === '') return null;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
  
  return value;
};

export const getFieldProps = (
  field: CustomField, 
  value: string | number | null = "",
  onChange: (field: CustomField, value: string) => void
) => {
  const stringValue = value === null ? "" : String(value);
  
  const baseProps = {
    id: field.key,
    name: field.key,
    placeholder: `Enter ${field.label.toLowerCase()}`,
    value: stringValue,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
      onChange(field, e.target.value),
    required: field.required,
    className: field.required ? "border-l-4 border-l-purple-500 pl-3" : "",
  };
  
  if (field.type === 'number') {
    return {
      ...baseProps,
      type: 'number',
      step: 'any',
    };
  }
  
  if (field.type === 'date') {
    return {
      ...baseProps,
      type: 'date',
    };
  }
  
  // Default to text type
  return {
    ...baseProps,
    type: 'text',
  };
};
