
import { SupportTicket, SupportTicketApiRequest } from "@/domain/models/support";
import { api } from "@/utils/api";

export const supportService = {
  // Fetch all support tickets
  getSupportTickets: async (): Promise<SupportTicket[]> => {
    return await api.get<SupportTicket[]>("/support");
  },

  // Get support ticket by ID
  getSupportTicketById: async (id: string): Promise<SupportTicket | undefined> => {
    return await api.get<SupportTicket>(`/support/${id}`);
  },

  // Get support tickets by customer ID
  getSupportTicketsByCustomerId: async (customerId: string): Promise<SupportTicket[]> => {
    return await api.get<SupportTicket[]>(`/support?id=${customerId}`);
  },

  // Create a new support ticket
  createSupportTicket: async (ticketData: SupportTicketApiRequest): Promise<SupportTicket> => {
    return await api.post<SupportTicket>("/support", ticketData);
  },

  // Update an existing support ticket
  updateSupportTicket: async (id: string, ticketData: SupportTicketApiRequest): Promise<SupportTicket> => {
    return await api.put<SupportTicket>(`/support/${id}`, ticketData);
  },

  // Delete a support ticket
  deleteSupportTicket: async (id: string): Promise<void> => {
    return await api.delete<void>(`/support/${id}`);
  }
};
