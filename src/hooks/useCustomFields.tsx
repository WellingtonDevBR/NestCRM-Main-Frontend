
import { useState, useEffect } from "react";
import { CustomField } from "@/types/customer";
import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Storage key for custom fields (fallback when API is unavailable)
const STORAGE_KEY = "customer_custom_fields";

// Fallback storage functions
const getStoredFields = (): CustomField[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading custom fields from localStorage:", e);
    return [];
  }
};

const storeFields = (fields: CustomField[]): void => {
  try {
    // Validate fields before storage
    const validFields = fields.filter(field => field.key && field.label);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validFields));
  } catch (e) {
    console.error("Error storing custom fields in localStorage:", e);
    throw new Error("Failed to save custom fields to localStorage");
  }
};

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
        const data = await api.get<CustomField[]>("/api/settings/custom-fields")
          .catch(() => {
            console.log("API fetch failed, falling back to localStorage");
            return getStoredFields();
          });
        
        // If we have data, also update localStorage as a cache
        if (Array.isArray(data)) {
          storeFields(data);
        }
        
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error("Failed to fetch custom fields:", error);
        // Fallback to localStorage on error
        return getStoredFields();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  const { mutateAsync: updateCustomFields, isPending: isUpdating } = useMutation({
    mutationFn: async (fields: CustomField[]) => {
      try {
        // Try to update via API
        const response = await api.post<CustomField[]>("/api/settings/custom-fields", fields)
          .catch((error) => {
            console.log("API update failed, falling back to localStorage", error);
            storeFields(fields);
            return fields;
          });
        
        // Always update localStorage as cache
        storeFields(Array.isArray(response) ? response : fields);
        return response;
      } catch (error) {
        console.error("Failed to update custom fields:", error);
        // Fallback to local storage on error
        storeFields(fields);
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
