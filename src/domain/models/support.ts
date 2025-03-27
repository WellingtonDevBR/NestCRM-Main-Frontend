
// Support domain models
export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  ticketNumber: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}
