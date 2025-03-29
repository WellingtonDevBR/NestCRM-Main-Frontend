
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Interaction, InteractionApiRequest } from "@/domain/models/interaction";
import { interactionService } from "@/services/interactionService";
import { toast } from "sonner";

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

  const { mutateAsync: createInteraction, isPending: isCreating } = useMutation({
    mutationFn: (interactionData: InteractionApiRequest) => 
      interactionService.createInteraction(interactionData),
    onSuccess: () => {
      toast.success("Interaction logged successfully");
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
    onError: (error) => {
      console.error("Error logging interaction:", error);
      toast.error("Failed to log interaction");
    }
  });

  const { mutateAsync: updateInteraction, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & InteractionApiRequest) => 
      interactionService.updateInteraction(id, data),
    onSuccess: () => {
      toast.success("Interaction updated successfully");
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
    onError: (error) => {
      console.error("Error updating interaction:", error);
      toast.error("Failed to update interaction");
    }
  });

  const { mutateAsync: deleteInteraction, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => 
      interactionService.deleteInteraction(id),
    onSuccess: () => {
      toast.success("Interaction deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
    onError: (error) => {
      console.error("Error deleting interaction:", error);
      toast.error("Failed to delete interaction");
    }
  });

  return {
    interactions,
    isLoading,
    error,
    refetch,
    createInteraction,
    updateInteraction,
    deleteInteraction,
    isCreating,
    isUpdating,
    isDeleting
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
