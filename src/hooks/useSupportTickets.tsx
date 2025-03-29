
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supportService } from "@/services/supportService";
import { SupportTicket, SupportTicketApiRequest } from "@/domain/models/support";

export function useSupportTickets() {
  const queryClient = useQueryClient();
  
  // Fetch all support tickets
  const { 
    data: supportTickets = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["supportTickets"],
    queryFn: async () => {
      try {
        const tickets = await supportService.getSupportTickets();
        console.log("Fetched support tickets:", tickets);
        return tickets;
      } catch (error) {
        console.error("Error fetching support tickets:", error);
        throw error;
      }
    }
  });
  
  // Create a new support ticket
  const { mutateAsync: createSupportTicket } = useMutation({
    mutationFn: async (ticketData: SupportTicketApiRequest) => {
      return await supportService.createSupportTicket(ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
    onError: (error) => {
      console.error("Error creating support ticket:", error);
      toast.error("Failed to create support ticket");
    }
  });
  
  // Update a support ticket
  const { mutateAsync: updateSupportTicket } = useMutation({
    mutationFn: async ({ id, ...ticketData }: SupportTicketApiRequest & { id: string }) => {
      return await supportService.updateSupportTicket(id, ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
    onError: (error) => {
      console.error("Error updating support ticket:", error);
      toast.error("Failed to update support ticket");
    }
  });
  
  // Delete a support ticket
  const { mutateAsync: deleteSupportTicket } = useMutation({
    mutationFn: async (id: string) => {
      return await supportService.deleteSupportTicket(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supportTickets"] });
    },
    onError: (error) => {
      console.error("Error deleting support ticket:", error);
      toast.error("Failed to delete support ticket");
    }
  });
  
  return {
    supportTickets,
    isLoading,
    error,
    refetch,
    createSupportTicket,
    updateSupportTicket,
    deleteSupportTicket
  };
}
