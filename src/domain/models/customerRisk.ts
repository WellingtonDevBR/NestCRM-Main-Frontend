
// Customer risk domain models
export interface CustomerRiskData {
  id: number;
  name: string;
  email: string;
  industry: string;
  value: string;
  riskScore: number;
  status: 'High Risk' | 'Medium Risk' | 'Low Risk';
}
