
import { useQuery } from "@tanstack/react-query";
import { Interaction } from "@/domain/models/interaction";
import { interactionService } from "@/services/interactionService";

export const useInteractions = () => {
  const {
    data: interactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["interactions"],
    queryFn: interactionService.getInteractions,
  });

  return {
    interactions,
    isLoading,
    error,
    refetch,
  };
};

export const useInteractionById = (id: string) => {
  const {
    data: interaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interaction", id],
    queryFn: () => interactionService.getInteractionById(id),
    enabled: !!id,
  });

  return {
    interaction,
    isLoading,
    error,
  };
};

export const useInteractionsByCustomerId = (customerId: string) => {
  const {
    data: interactions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["interactions", "customer", customerId],
    queryFn: () => interactionService.getInteractionsByCustomerId(customerId),
    enabled: !!customerId,
  });

  return {
    interactions,
    isLoading,
    error,
  };
};
