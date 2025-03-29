
export interface Interaction {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'note' | 'chat' | 'other';
  subject: string;
  content: string;
  status: 'open' | 'closed' | 'pending';
  assignedTo?: string;
  duration?: number;
  summary?: string;
  agentName?: string;
  customFields?: Record<string, string | number | boolean | Date>;
}

export interface InteractionAssociations {
  id?: string;
  email?: string;
}

export interface InteractionApiRequest {
  customFields: Record<string, string | number | boolean | Date>;
  associations: InteractionAssociations;
  type?: Interaction['type'];
  subject?: string;
  content?: string;
  status?: Interaction['status'];
  duration?: number;
  assignedTo?: string;
  agentName?: string;
}
