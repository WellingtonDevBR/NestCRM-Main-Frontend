
import { useQuery } from "@tanstack/react-query";
import { useCustomFields } from "@/hooks/useCustomFields";
import { CustomField } from "@/domain/models/customField";

export function useEntityCustomFields(entityType: string) {
  const { getCategoryFields, useCategoryFields } = useCustomFields();
  
  // Fetch custom fields for the entity
  const { data, isLoading, error } = useCategoryFields(entityType);
  
  // Get fields with fallback
  const fields = data?.fields || getCategoryFields(entityType) || [];
  
  return {
    fields,
    isLoading,
    error,
  };
}
