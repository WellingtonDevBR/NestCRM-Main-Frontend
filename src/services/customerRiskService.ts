
import { CustomerRiskData } from "@/domain/models/customerRisk";

// Mock customer risk data
const mockCustomers: CustomerRiskData[] = [
  {
    id: 1,
    name: "Acme Corporation",
    email: "contact@acmecorp.com",
    industry: "Manufacturing",
    value: "$120,000",
    riskScore: 85,
    status: "High Risk",
    customFields: {
      subscriptionPlan: "Enterprise",
      activeUsers: "150",
      lastInteraction: "2023-09-01",
      supportTickets: "12",
      paymentStatus: "Current"
    }
  },
  {
    id: 2,
    name: "TechStart Inc",
    email: "info@techstart.io",
    industry: "Technology",
    value: "$75,000",
    riskScore: 65,
    status: "Medium Risk",
    customFields: {
      subscriptionPlan: "Growth",
      activeUsers: "45",
      lastInteraction: "2023-09-05",
      supportTickets: "3",
      paymentStatus: "Current"
    }
  },
  {
    id: 3,
    name: "Global Services Ltd",
    email: "hello@globalservices.co",
    industry: "Professional Services",
    value: "$95,000",
    riskScore: 25,
    status: "Low Risk",
    customFields: {
      subscriptionPlan: "Enterprise",
      activeUsers: "112",
      lastInteraction: "2023-09-10",
      supportTickets: "1",
      paymentStatus: "Current"
    }
  },
  {
    id: 4,
    name: "Data Systems Corp",
    email: "support@datasystems.corp",
    industry: "Information Technology",
    value: "$60,000",
    riskScore: 45,
    status: "Medium Risk",
    customFields: {
      subscriptionPlan: "Professional",
      activeUsers: "78",
      lastInteraction: "2023-08-28",
      supportTickets: "5",
      paymentStatus: "Overdue"
    }
  },
  {
    id: 5,
    name: "InnovateTech",
    email: "contact@innovatetech.com",
    industry: "Software",
    value: "$35,000",
    riskScore: 15,
    status: "Low Risk",
    customFields: {
      subscriptionPlan: "Growth",
      activeUsers: "23",
      lastInteraction: "2023-09-08",
      supportTickets: "0",
      paymentStatus: "Current"
    }
  },
  {
    id: 6,
    name: "Nexus Solutions",
    email: "info@nexussolutions.net",
    industry: "Consulting",
    value: "$85,000",
    riskScore: 78,
    status: "High Risk",
    customFields: {
      subscriptionPlan: "Enterprise",
      activeUsers: "95",
      lastInteraction: "2023-08-15",
      supportTickets: "9",
      paymentStatus: "Current"
    }
  }
];

export const customerRiskService = {
  getCustomers: () => {
    // This would be replaced with an actual API call
    return mockCustomers;
  },
  
  searchCustomers: (term: string, status: string) => {
    // Filter customers based on search term and status
    let filteredCustomers = [...mockCustomers];
    
    if (term) {
      const lowerTerm = term.toLowerCase();
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(lowerTerm) || 
        customer.email.toLowerCase().includes(lowerTerm) ||
        customer.industry.toLowerCase().includes(lowerTerm)
      );
    }
    
    if (status && status !== "All") {
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.status === status
      );
    }
    
    return filteredCustomers;
  }
};
