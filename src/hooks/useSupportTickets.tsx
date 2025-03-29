
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportTicket } from "@/domain/models/support";
import { supportService } from "@/services/supportService";
import { toast } from "sonner";

export const useSupportTickets = () => {
  const queryClient = useQueryClient();
  
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: supportService.getSupportTickets,
  });

  const { mutateAsync: createTicket, isPending: isCreating } = useMutation({
    mutationFn: (ticketData: any) => 
      supportService.createSupportTicket(ticketData),
    onSuccess: () => {
      toast.success("Support ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error) => {
      console.error("Error creating support ticket:", error);
      toast.error("Failed to create support ticket");
    }
  });

  const { mutateAsync: updateTicket, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...updateData }: { id: string } & any) => 
      supportService.updateSupportTicket(id, updateData),
    onSuccess: () => {
      toast.success("Support ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error) => {
      console.error("Error updating support ticket:", error);
      toast.error("Failed to update support ticket");
    }
  });

  const { mutateAsync: deleteTicket, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => 
      supportService.deleteSupportTicket(id),
    onSuccess: () => {
      toast.success("Support ticket deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    },
    onError: (error) => {
      console.error("Error deleting support ticket:", error);
      toast.error("Failed to delete support ticket");
    }
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
    createTicket,
    updateTicket,
    deleteTicket,
    isCreating,
    isUpdating,
    isDeleting
  };
};

export const useSupportTicketById = (id: string) => {
  const {
    data: ticket,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => supportService.getSupportTicketById(id),
    enabled: !!id,
  });

  return {
    ticket,
    isLoading,
    error,
  };
};

export const useSupportTicketsByCustomerId = (customerId: string) => {
  const {
    data: tickets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["support-tickets", "customer", customerId],
    queryFn: () => supportService.getSupportTicketsByCustomerId(customerId),
    enabled: !!customerId,
  });

  return {
    tickets,
    isLoading,
    error,
  };
};
