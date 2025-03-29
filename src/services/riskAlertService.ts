
import { RiskAlert } from "@/domain/models/riskAlert";

// Mock risk alerts
const mockRiskAlerts: RiskAlert[] = [
  {
    id: "alert-1",
    customerId: "cust-1",
    customerName: "Acme Corporation",
    alertType: "churn_risk",
    severity: "critical",
    description: "Customer has shown a 60% decrease in product usage over the last 30 days",
    createdAt: "2023-09-05T10:15:22Z",
    status: "new"
  },
  {
    id: "alert-2",
    customerId: "cust-2",
    customerName: "TechStart Inc",
    alertType: "activity_drop",
    severity: "high",
    description: "Active users dropped from 45 to 20 in the last 2 weeks",
    createdAt: "2023-09-06T14:30:15Z",
    status: "acknowledged",
    assignedTo: "Jane Smith"
  },
  {
    id: "alert-3",
    customerId: "cust-6",
    customerName: "Nexus Solutions",
    alertType: "support_escalation",
    severity: "medium",
    description: "Multiple unresolved support tickets with increasing severity",
    createdAt: "2023-09-07T09:45:33Z",
    status: "resolved",
    assignedTo: "Mike Johnson"
  },
  {
    id: "alert-4",
    customerId: "cust-4",
    customerName: "Data Systems Corp",
    alertType: "payment_issue",
    severity: "high",
    description: "Payment failed twice in the last billing cycle",
    createdAt: "2023-09-08T11:20:45Z",
    status: "new"
  },
  {
    id: "alert-5",
    customerId: "cust-7",
    customerName: "WebFlow Dynamics",
    alertType: "churn_risk",
    severity: "critical",
    description: "Customer mentioned competitor products in recent support calls",
    createdAt: "2023-09-09T15:10:18Z",
    status: "new"
  },
  {
    id: "alert-6",
    customerId: "cust-8",
    customerName: "Global Innovations",
    alertType: "activity_drop",
    severity: "medium",
    description: "Key admin users haven't logged in for 15 days",
    createdAt: "2023-09-10T08:25:30Z",
    status: "acknowledged",
    assignedTo: "Sarah Phillips"
  },
  {
    id: "alert-7",
    customerId: "cust-9",
    customerName: "Atlas Engineering",
    alertType: "support_escalation",
    severity: "low",
    description: "Increased number of feature requests and support inquiries",
    createdAt: "2023-09-10T13:40:55Z",
    status: "dismissed"
  },
  {
    id: "alert-8",
    customerId: "cust-10",
    customerName: "Quantum Media",
    alertType: "payment_issue",
    severity: "high",
    description: "Customer requested to downgrade their subscription plan",
    createdAt: "2023-09-11T10:05:12Z",
    status: "new"
  }
];

export const riskAlertService = {
  // Fetch all risk alerts
  getRiskAlerts: async (): Promise<RiskAlert[]> => {
    // This would be replaced with an actual API call
    return mockRiskAlerts;
  },

  // Get alerts by status
  getAlertsByStatus: async (status: RiskAlert['status']): Promise<RiskAlert[]> => {
    // This would be replaced with an actual API call
    return mockRiskAlerts.filter(alert => alert.status === status);
  },

  // Get alerts by customer ID
  getAlertsByCustomerId: async (customerId: string): Promise<RiskAlert[]> => {
    // This would be replaced with an actual API call
    return mockRiskAlerts.filter(alert => alert.customerId === customerId);
  },

  // Update alert status
  updateAlertStatus: async (alertId: string, status: RiskAlert['status'], assignedTo?: string): Promise<RiskAlert> => {
    // In a real app, this would update the database
    // Here we just simulate the update by returning a modified alert
    const alert = mockRiskAlerts.find(a => a.id === alertId);
    if (!alert) {
      throw new Error(`Alert with ID ${alertId} not found`);
    }
    
    // Return a copy of the alert with updated status
    return {
      ...alert,
      status,
      assignedTo: assignedTo || alert.assignedTo
    };
  }
};
