
import { Interaction, InteractionApiRequest } from "@/domain/models/interaction";
import { api } from "@/utils/api";

export const interactionService = {
  // Fetch all interactions
  getInteractions: async (): Promise<Interaction[]> => {
    return await api.get<Interaction[]>("/interaction");
  },

  // Get interaction by ID
  getInteractionById: async (id: string): Promise<Interaction | undefined> => {
    return await api.get<Interaction>(`/interaction/${id}`);
  },

  // Get interactions by customer ID
  getInteractionsByCustomerId: async (customerId: string): Promise<Interaction[]> => {
    return await api.get<Interaction[]>(`/interaction?id=${customerId}`);
  },

  // Create a new interaction
  createInteraction: async (interactionData: InteractionApiRequest): Promise<Interaction> => {
    return await api.post<Interaction>("/interaction", interactionData);
  },

  // Update an existing interaction
  updateInteraction: async (id: string, interactionData: InteractionApiRequest): Promise<Interaction> => {
    return await api.put<Interaction>(`/interaction/${id}`, interactionData);
  },

  // Delete an interaction
  deleteInteraction: async (id: string): Promise<void> => {
    return await api.delete<void>(`/interaction/${id}`);
  }
};
