
export interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'other';
  subject: string;
  content: string;
  status: 'open' | 'closed';
  assignedTo?: string;
  customFields?: Record<string, string | number | boolean | Date>;
}
