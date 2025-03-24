
import { useState, useEffect } from "react";
import { CustomField } from "@/types/customer";
import { api } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Mock storage function - replace with API calls later
const getStoredFields = (): CustomField[] => {
  try {
    const stored = localStorage.getItem("customer_custom_fields");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Error reading custom fields:", e);
    return [];
  }
};

const storeFields = (fields: CustomField[]): void => {
  try {
    localStorage.setItem("customer_custom_fields", JSON.stringify(fields));
  } catch (e) {
    console.error("Error storing custom fields:", e);
  }
};

export function useCustomFields() {
  const queryClient = useQueryClient();

  const { data: customFields = [], isLoading } = useQuery({
    queryKey: ["customerCustomFields"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return await api.get("/api/customer/custom-fields");
      return getStoredFields();
    }
  });

  const { mutateAsync: updateCustomFields } = useMutation({
    mutationFn: async (fields: CustomField[]) => {
      // TODO: Replace with actual API call
      // await api.post("/api/customer/custom-fields", fields);
      storeFields(fields);
      return fields;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerCustomFields"] });
      toast.success("Custom fields updated successfully");
    }
  });

  return {
    customFields,
    isLoading,
    updateCustomFields
  };
}
