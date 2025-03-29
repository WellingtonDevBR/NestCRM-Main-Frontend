
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { interactionService } from "@/services/interactionService";
import { Interaction, InteractionApiRequest } from "@/domain/models/interaction";

export function useInteractions() {
  const queryClient = useQueryClient();
  
  // Fetch all interactions
  const { 
    data: interactions = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ["interactions"],
    queryFn: async () => {
      try {
        const interactions = await interactionService.getInteractions();
        console.log("Fetched interactions:", interactions);
        return interactions;
      } catch (error) {
        console.error("Error fetching interactions:", error);
        throw error;
      }
    }
  });
  
  // Create a new interaction
  const { mutateAsync: createInteraction } = useMutation({
    mutationFn: async (interactionData: InteractionApiRequest) => {
      return await interactionService.createInteraction(interactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
    onError: (error) => {
      console.error("Error creating interaction:", error);
      toast.error("Failed to create interaction");
    }
  });
  
  // Update an interaction
  const { mutateAsync: updateInteraction } = useMutation({
    mutationFn: async ({ id, ...interactionData }: InteractionApiRequest & { id: string }) => {
      return await interactionService.updateInteraction(id, interactionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
    onError: (error) => {
      console.error("Error updating interaction:", error);
      toast.error("Failed to update interaction");
    }
  });
  
  // Delete an interaction
  const { mutateAsync: deleteInteraction } = useMutation({
    mutationFn: async (id: string) => {
      return await interactionService.deleteInteraction(id);
    },
    onSuccess: () => {
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
    deleteInteraction
  };
}
