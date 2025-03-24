
// Customer risk domain models
export interface CustomerRiskData {
  id: number;
  name: string;
  email: string;
  industry: string;
  value: string;
  riskScore: number;
  status: 'High Risk' | 'Medium Risk' | 'Low Risk';
  customFields?: Record<string, any>;
}

export interface ColumnVisibility {
  name: boolean;
  email: boolean;
  industry: boolean;
  value: boolean;
  riskScore: boolean;
  status: boolean;
  [key: string]: boolean; // Allow dynamic custom field keys
}
