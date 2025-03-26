
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
