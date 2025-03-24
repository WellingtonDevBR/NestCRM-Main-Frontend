
// Risk Alert domain models
export interface RiskAlert {
  id: string;
  customerId: string;
  customerName: string;
  alertType: 'churn_risk' | 'activity_drop' | 'support_escalation' | 'payment_issue';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  createdAt: string;
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  assignedTo?: string;
}
