
import { useQuery } from "@tanstack/react-query";
import { SupportTicket } from "@/domain/models/support";
import { supportService } from "@/services/supportService";

export const useSupportTickets = () => {
  const {
    data: tickets = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["support-tickets"],
    queryFn: supportService.getSupportTickets,
  });

  return {
    tickets,
    isLoading,
    error,
    refetch,
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
