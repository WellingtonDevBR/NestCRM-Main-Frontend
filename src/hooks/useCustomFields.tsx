import { useState, useEffect } from "react";
import { CustomField } from "@/domain/models/customer";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchCustomFields, saveCustomFields } from "@/utils/customFieldsApi";
import { getStoredCustomFields, storeCustomFields } from "@/utils/localStorage";

export function useCustomFields() {
  const queryClient = useQueryClient();

  const { 
    data: customFields = [], 
    isLoading, 
    error,
    isError,
    isFetching
  } = useQuery({
    queryKey: ["customerCustomFields"],
    queryFn: async () => {
      try {
        // Try to fetch from API first
        const fields = await fetchCustomFields()
          .catch(() => {
            console.log("API fetch failed, falling back to localStorage");
            return getStoredCustomFields();
          });
        
        // Update localStorage as a cache
        if (Array.isArray(fields)) {
          storeCustomFields(fields);
        }
        
        return fields;
      } catch (error) {
        console.error("Failed to fetch custom fields:", error);
        // Fallback to localStorage on error
        return getStoredCustomFields();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  const { mutateAsync: updateCustomFields, isPending: isUpdating } = useMutation({
    mutationFn: async (fields: CustomField[]) => {
      try {
        // Try to update via API
        const response = await saveCustomFields(fields)
          .catch((error) => {
            console.log("API update failed, falling back to localStorage", error);
            storeCustomFields(fields);
            return fields;
          });
        
        // Always update localStorage as cache
        storeCustomFields(Array.isArray(response) ? response : fields);
        return Array.isArray(response) ? response : fields;
      } catch (error) {
        console.error("Failed to update custom fields:", error);
        // Fallback to local storage on error
        storeCustomFields(fields);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerCustomFields"] });
      toast.success("Custom fields updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update custom fields on the server");
      console.error(error);
    }
  });

  return {
    customFields,
    isLoading: isLoading || isFetching,
    isUpdating,
    error,
    updateCustomFields
  };
}
