
export interface Payment {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  orderId?: string;
  orderNumber: string;
  date: string;
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'cash' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  customFields?: Record<string, string | number | boolean | Date>;
}

export interface PaymentAssociations {
  id?: string;
  email?: string;
  order_id?: string;
}

export interface PaymentApiRequest {
  customFields: Record<string, string | number | boolean | Date>;
  associations: PaymentAssociations;
  method?: Payment['method'];
  amount?: number;
  reference?: string;
  status?: Payment['status'];
}
