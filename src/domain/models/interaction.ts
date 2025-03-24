
// Interaction domain models
export interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'email' | 'call' | 'meeting' | 'chat';
  date: string;
  duration: number;
  subject: string;
  summary: string;
  agentName: string;
  status: 'open' | 'closed' | 'pending';
}
