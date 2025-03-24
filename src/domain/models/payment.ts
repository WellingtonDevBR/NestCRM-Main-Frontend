
// Payment domain models
export interface Payment {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  date: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'paypal' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
}
