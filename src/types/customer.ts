
export interface CustomField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number';
  required: boolean;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  customFields: {
    [key: string]: string | number | null;
  };
}
