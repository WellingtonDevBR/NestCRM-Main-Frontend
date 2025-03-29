
import { Order, OrderApiRequest } from "@/domain/models/order";
import { api } from "@/utils/api";

export const orderService = {
  // Fetch all orders
  getOrders: async (): Promise<Order[]> => {
    return await api.get<Order[]>("/order");
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order | undefined> => {
    return await api.get<Order>(`/order/${id}`);
  },

  // Get orders by customer ID
  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    return await api.get<Order[]>(`/order?id=${customerId}`);
  },

  // Create a new order
  createOrder: async (orderData: OrderApiRequest): Promise<Order> => {
    return await api.post<Order>("/order", orderData);
  },

  // Update an existing order
  updateOrder: async (id: string, orderData: OrderApiRequest): Promise<Order> => {
    return await api.put<Order>(`/order/${id}`, orderData);
  },

  // Delete an order
  deleteOrder: async (id: string): Promise<void> => {
    return await api.delete<void>(`/order/${id}`);
  }
};
