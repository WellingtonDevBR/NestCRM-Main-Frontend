
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SupportTicket } from "@/domain/models/support";
import { supportService } from "@/services/supportService";

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

  const { mutateAsync: createTicket } = useMutation({
    mutationFn: (ticketData: any) => 
      supportService.createSupportTicket(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    }
  });

  const { mutateAsync: updateTicket } = useMutation({
    mutationFn: ({ id, ...updateData }: { id: string } & any) => 
      supportService.updateSupportTicket(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
    }
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
    createTicket,
    updateTicket
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
