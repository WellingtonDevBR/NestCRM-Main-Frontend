
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dateCreated: string;
  dateUpdated: string;
  assignedTo?: string;
  customFields?: Record<string, string | number | boolean | Date>;
}

export interface SupportTicketAssociations {
  id?: string;
  email?: string;
}

export interface SupportTicketApiRequest {
  customFields: Record<string, string | number | boolean | Date>;
  associations: SupportTicketAssociations;
  subject?: string;
  description?: string;
  status?: SupportTicket['status'];
  priority?: SupportTicket['priority'];
  assignedTo?: string;
}
