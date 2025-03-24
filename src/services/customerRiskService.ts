
import { CustomerRiskData } from "@/domain/models/customerRisk";

// Sample customer data with churn risk scores
const CUSTOMERS: CustomerRiskData[] = [
  { id: 1, name: 'Acme Corp', email: 'contact@acmecorp.com', industry: 'Technology', value: '$12,500', riskScore: 87, status: 'High Risk' },
  { id: 2, name: 'Globex', email: 'info@globex.com', industry: 'Finance', value: '$28,900', riskScore: 62, status: 'Medium Risk' },
  { id: 3, name: 'Initech', email: 'support@initech.com', industry: 'Healthcare', value: '$8,300', riskScore: 34, status: 'Low Risk' },
  { id: 4, name: 'Umbrella Corp', email: 'contact@umbrella.com', industry: 'Biotech', value: '$45,200', riskScore: 91, status: 'High Risk' },
  { id: 5, name: 'Massive Dynamic', email: 'info@massivedynamic.com', industry: 'Research', value: '$32,100', riskScore: 28, status: 'Low Risk' },
  { id: 6, name: 'Stark Industries', email: 'sales@stark.com', industry: 'Manufacturing', value: '$67,800', riskScore: 53, status: 'Medium Risk' },
  { id: 7, name: 'Wayne Enterprises', email: 'info@wayne.com', industry: 'Technology', value: '$54,600', riskScore: 18, status: 'Low Risk' },
  { id: 8, name: 'Cyberdyne Systems', email: 'support@cyberdyne.com', industry: 'AI', value: '$21,300', riskScore: 76, status: 'High Risk' },
  { id: 9, name: 'Soylent Corp', email: 'info@soylent.com', industry: 'Food', value: '$15,700', riskScore: 48, status: 'Medium Risk' },
  { id: 10, name: 'Weyland-Yutani', email: 'contact@weyland.com', industry: 'Aerospace', value: '$87,400', riskScore: 82, status: 'High Risk' },
];

export const customerRiskService = {
  getCustomers: () => CUSTOMERS,
  
  searchCustomers: (term: string, status: string) => {
    let results = CUSTOMERS;
    
    // Filter by search term
    if (term) {
      results = results.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.industry.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status !== 'All') {
      results = results.filter(customer => customer.status === status);
    }
    
    return results;
  }
};
