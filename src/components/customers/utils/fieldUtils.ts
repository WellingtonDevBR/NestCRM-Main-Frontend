
import { CustomField } from "@/domain/models/customer";

/**
 * Process field value based on field type
 */
export const processFieldValue = (field: CustomField, value: string): string | number | null => {
  if (field.type === 'number') {
    return value === "" ? null : Number(value);
  }
  return value;
};

/**
 * Get common props for a field input
 */
export const getFieldProps = (
  field: CustomField, 
  value: string | number | null,
  onChange: (field: CustomField, value: string) => void
) => {
  // Common props
  const props: any = {
    id: field.key,
    placeholder: `Enter ${field.label.toLowerCase()}`,
    required: field.required,
    className: field.required ? "border-l-4 border-l-purple-500 pl-3" : "",
    value: value === null ? "" : value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => 
      onChange(field, e.target.value)
  };
  
  // Type-specific props
  if (field.type === 'date') {
    props.type = 'date';
  } else if (field.type === 'number') {
    props.type = 'number';
    props.step = '1';
  } else {
    props.type = 'text';
  }
  
  return props;
};
