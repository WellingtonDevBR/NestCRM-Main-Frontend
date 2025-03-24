
import { Payment } from "@/domain/models/payment";

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: "pay-001",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    orderNumber: "ORD-2023-0001",
    date: "2023-11-15T10:35:00Z",
    amount: 249.99,
    method: "credit_card",
    status: "completed",
    reference: "TRX-2023-11-15-001"
  },
  {
    id: "pay-002",
    customerId: "cust-002",
    customerName: "Bob Smith",
    orderNumber: "ORD-2023-0002",
    date: "2023-12-03T14:50:00Z",
    amount: 149.99,
    method: "paypal",
    status: "completed",
    reference: "TRX-2023-12-03-001"
  },
  {
    id: "pay-003",
    customerId: "cust-003",
    customerName: "Carol Davis",
    orderNumber: "ORD-2023-0003",
    date: "2023-12-10T09:20:00Z",
    amount: 398.98,
    method: "bank_transfer",
    status: "pending",
    reference: "TRX-2023-12-10-001"
  },
  {
    id: "pay-004",
    customerId: "cust-004",
    customerName: "David Wilson",
    orderNumber: "ORD-2023-0004",
    date: "2023-12-15T16:25:00Z",
    amount: 99.99,
    method: "credit_card",
    status: "failed",
    reference: "TRX-2023-12-15-001"
  },
  {
    id: "pay-005",
    customerId: "cust-005",
    customerName: "Eve Brown",
    orderNumber: "ORD-2023-0005",
    date: "2023-12-18T11:10:00Z",
    amount: 349.98,
    method: "credit_card",
    status: "refunded",
    reference: "TRX-2023-12-18-001"
  },
  {
    id: "pay-006",
    customerId: "cust-001",
    customerName: "Alice Johnson",
    orderNumber: "ORD-2024-0001",
    date: "2024-01-20T13:45:00Z",
    amount: 299.99,
    method: "credit_card",
    status: "completed",
    reference: "TRX-2024-01-20-001"
  }
];

export const paymentService = {
  // Fetch all payments
  getPayments: async (): Promise<Payment[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPayments), 800);
    });
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<Payment | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = mockPayments.find(payment => payment.id === id);
        resolve(payment);
      }, 500);
    });
  },

  // Get payments by customer ID
  getPaymentsByCustomerId: async (customerId: string): Promise<Payment[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const payments = mockPayments.filter(payment => payment.customerId === customerId);
        resolve(payments);
      }, 500);
    });
  }
};
