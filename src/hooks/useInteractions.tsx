
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Interaction, InteractionApiRequest } from "@/domain/models/interaction";
import { interactionService } from "@/services/interactionService";

export const useInteractions = () => {
  const queryClient = useQueryClient();
  
  const {
    data: interactions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["interactions"],
    queryFn: interactionService.getInteractions,
  });

  const { mutateAsync: createInteraction } = useMutation({
    mutationFn: (interactionData: InteractionApiRequest) => 
      interactionService.createInteraction(interactionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    }
  });

  return {
    interactions,
    isLoading,
    error,
    refetch,
    createInteraction
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
