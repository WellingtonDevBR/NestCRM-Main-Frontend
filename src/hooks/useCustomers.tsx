
import { useState } from "react";
import { Customer, CustomerFormData } from "@/domain/models/customer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerService } from "@/services/customerService";

export function useCustomers() {
  const queryClient = useQueryClient();
  
  // Fetch customers
  const {
    data: customers = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["customers"],
    queryFn: customerService.getCustomers
  });

  // Add a new customer
  const { mutateAsync: addCustomer } = useMutation({
    mutationFn: customerService.createCustomer,
    onSuccess: () => {
      // Invalidate the customers query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  // Update a customer
  const { mutateAsync: updateCustomer } = useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string } & CustomerFormData) => {
      return customerService.updateCustomer(id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  // Delete a customer
  const { mutateAsync: deleteCustomer } = useMutation({
    mutationFn: customerService.deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    }
  });

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  };
}
