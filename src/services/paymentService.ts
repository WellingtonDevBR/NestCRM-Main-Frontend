
import { Payment, PaymentApiRequest } from "@/domain/models/payment";
import { api } from "@/utils/api";

export const paymentService = {
  // Fetch all payments
  getPayments: async (): Promise<Payment[]> => {
    return await api.get<Payment[]>("/payment");
  },

  // Get payment by ID
  getPaymentById: async (id: string): Promise<Payment | undefined> => {
    return await api.get<Payment>(`/payment/${id}`);
  },

  // Get payments by customer ID
  getPaymentsByCustomerId: async (customerId: string): Promise<Payment[]> => {
    return await api.get<Payment[]>(`/payment?id=${customerId}`);
  },

  // Create a new payment
  createPayment: async (paymentData: PaymentApiRequest): Promise<Payment> => {
    return await api.post<Payment>("/payment", paymentData);
  },

  // Update an existing payment
  updatePayment: async (id: string, paymentData: PaymentApiRequest): Promise<Payment> => {
    return await api.put<Payment>(`/payment/${id}`, paymentData);
  },

  // Delete a payment
  deletePayment: async (id: string): Promise<void> => {
    return await api.delete<void>(`/payment/${id}`);
  }
};
