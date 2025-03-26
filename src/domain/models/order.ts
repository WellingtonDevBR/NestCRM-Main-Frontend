
// Order domain models
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  customFields?: Record<string, string | number | boolean | Date>;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
