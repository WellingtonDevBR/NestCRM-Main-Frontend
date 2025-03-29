
// Customer domain models
export interface CustomField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'number' | 'select';
  required: boolean;
  options?: string[]; // Add options for select type fields
}

export interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  customFields: {
    [key: string]: string | number | null;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  customFields: {
    [key: string]: string | number | null;
  };
}

// API interfaces to match the server response format
export interface CustomerApiResponse {
  CustomerID: string;
  Name?: string;
  Email?: string;
  Phone?: string;
  CreatedAt: string;
  CustomFields?: {
    [key: string]: string | number | null;
  };
  customFields?: {
    [key: string]: string | number | null;
  };
  associations?: CustomerAssociations;
}

export interface CustomerAssociations {
  id?: string;
  email?: string;
}

export interface CustomerApiRequest {
  customFields: {
    [key: string]: string | number | null;
  };
  associations: CustomerAssociations;
}
