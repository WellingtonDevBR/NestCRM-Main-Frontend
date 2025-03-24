
import { RiskAlert } from "@/domain/models/riskAlert";

// Mock data for risk alerts
const mockRiskAlerts: RiskAlert[] = [
  {
    id: "alert-001",
    customerId: "cust-004",
    customerName: "David Wilson",
    alertType: "churn_risk",
    severity: "critical",
    description: "Customer showing multiple high-risk indicators including payment issues and decreased usage",
    createdAt: "2024-03-01T08:30:00Z",
    status: "new"
  },
  {
    id: "alert-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    alertType: "activity_drop",
    severity: "high",
    description: "User activity dropped by 65% in the last 30 days",
    createdAt: "2024-03-02T14:45:00Z",
    status: "acknowledged",
    assignedTo: "Sarah Johnson"
  },
  {
    id: "alert-003",
    customerId: "cust-007",
    customerName: "Frank Martin",
    alertType: "support_escalation",
    severity: "medium",
    description: "Multiple unresolved support tickets in the last 2 weeks",
    createdAt: "2024-03-03T11:15:00Z",
    status: "resolved"
  },
  {
    id: "alert-004",
    customerId: "cust-010",
    customerName: "Grace Lee",
    alertType: "payment_issue",
    severity: "high",
    description: "Last 2 payment attempts failed with insufficient funds error",
    createdAt: "2024-03-04T09:30:00Z",
    status: "new"
  },
  {
    id: "alert-005",
    customerId: "cust-008",
    customerName: "Harry Jones",
    alertType: "churn_risk",
    severity: "low",
    description: "Slight decrease in feature usage and one negative support interaction",
    createdAt: "2024-03-05T16:20:00Z",
    status: "dismissed"
  },
  {
    id: "alert-006",
    customerId: "cust-003",
    customerName: "Carol Davis",
    alertType: "activity_drop",
    severity: "medium",
    description: "Login frequency decreased by 40% in the last month",
    createdAt: "2024-03-06T10:00:00Z",
    status: "new"
  },
  {
    id: "alert-007",
    customerId: "cust-012",
    customerName: "Iris Wilson",
    alertType: "support_escalation",
    severity: "critical",
    description: "Customer escalated to management with threat to cancel subscription",
    createdAt: "2024-03-07T13:45:00Z",
    status: "acknowledged",
    assignedTo: "Michael Scott"
  }
];

export const riskAlertService = {
  // Fetch all risk alerts
  getRiskAlerts: async (): Promise<RiskAlert[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRiskAlerts), 800);
    });
  },

  // Get alerts by status
  getAlertsByStatus: async (status: RiskAlert['status']): Promise<RiskAlert[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const alerts = mockRiskAlerts.filter(alert => alert.status === status);
        resolve(alerts);
      }, 500);
    });
  },

  // Get alerts by customer ID
  getAlertsByCustomerId: async (customerId: string): Promise<RiskAlert[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const alerts = mockRiskAlerts.filter(alert => alert.customerId === customerId);
        resolve(alerts);
      }, 500);
    });
  },

  // Update alert status
  updateAlertStatus: async (alertId: string, status: RiskAlert['status'], assignedTo?: string): Promise<RiskAlert> => {
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const alertIndex = mockRiskAlerts.findIndex(alert => alert.id === alertId);
        if (alertIndex === -1) {
          reject(new Error("Alert not found"));
          return;
        }

        // Create updated alert
        const updatedAlert = {
          ...mockRiskAlerts[alertIndex],
          status,
          assignedTo
        };

        // In a real application, we would update the server
        // Here we just return the updated alert
        resolve(updatedAlert);
      }, 600);
    });
  }
};
