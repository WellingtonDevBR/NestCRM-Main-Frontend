
import { useState, useEffect } from "react";
import { CustomField } from "@/types/customer";
import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Storage key for custom fields
const STORAGE_KEY = "customer_custom_fields";

// Mock storage function - replace with API calls later
const getStoredFields = (): CustomField[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading custom fields:", e);
    return [];
  }
};

const storeFields = (fields: CustomField[]): void => {
  try {
    // Validate fields before storage
    const validFields = fields.filter(field => field.key && field.label);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validFields));
  } catch (e) {
    console.error("Error storing custom fields:", e);
    throw new Error("Failed to save custom fields");
  }
};

export function useCustomFields() {
  const queryClient = useQueryClient();

  const { data: customFields = [], isLoading, error } = useQuery({
    queryKey: ["customerCustomFields"],
    queryFn: async () => {
      try {
        // TODO: Replace with actual API call
        // return await api.get("/api/customer/custom-fields");
        return getStoredFields();
      } catch (error) {
        console.error("Failed to fetch custom fields:", error);
        return [];
      }
    }
  });

  const { mutateAsync: updateCustomFields, isPending: isUpdating } = useMutation({
    mutationFn: async (fields: CustomField[]) => {
      try {
        // TODO: Replace with actual API call
        // await api.post("/api/customer/custom-fields", fields);
        storeFields(fields);
        return fields;
      } catch (error) {
        console.error("Failed to update custom fields:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerCustomFields"] });
      toast.success("Custom fields updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update custom fields");
      console.error(error);
    }
  });

  return {
    customFields,
    isLoading,
    isUpdating,
    error,
    updateCustomFields
  };
}
