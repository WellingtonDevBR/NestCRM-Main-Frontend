
import { useState } from "react";
import { CustomField, CustomFieldCategory, FieldCategory } from "@/domain/models/customField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchCustomFields, 
  fetchCategoryFieldsFromApi, 
  fetchCategoryFields, 
  saveCustomFieldCategory 
} from "@/utils/customFieldsApi";
import { 
  getStoredCustomFields, 
  getStoredCategoryFields, 
  storeCustomFields, 
  storeCategoryFields 
} from "@/utils/localStorage";

export function useCustomFields() {
  const queryClient = useQueryClient();

  const { 
    data: customFieldCategories = [], 
    isLoading: isLoadingCategories, 
    error: categoriesError,
    isFetching: isFetchingCategories,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ["customFieldCategories"],
    queryFn: async () => {
      try {
        console.log("Fetching custom field categories");
        // Try to fetch from API first
        const categories = await fetchCustomFields()
          .catch((error) => {
            console.log("API fetch failed, falling back to localStorage", error);
            return getStoredCustomFields();
          });
        
        console.log("Fetched categories:", categories);
        
        // Update localStorage as a cache
        if (Array.isArray(categories)) {
          storeCustomFields(categories);
        }
        
        return categories;
      } catch (error) {
        console.error("Failed to fetch custom field categories:", error);
        // Fallback to localStorage on error
        return getStoredCustomFields();
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Function to fetch a specific category using a dedicated query
  const useCategoryFields = (category: FieldCategory) => {
    return useQuery({
      queryKey: ["customFieldCategory", category],
      queryFn: async () => {
        try {
          console.log(`Fetching fields for category: ${category}`);
          // Try to fetch from API first with specific category endpoint
          const categoryData = await fetchCategoryFieldsFromApi(category)
            .catch(() => {
              console.log(`API fetch failed for ${category}, falling back to localStorage`);
              const storedFields = getStoredCategoryFields(category);
              return { category, fields: storedFields };
            });
          
          console.log(`Fetched fields for ${category}:`, categoryData);
          
          // Update localStorage as a cache
          if (categoryData) {
            storeCategoryFields(categoryData);
          }
          
          return categoryData;
        } catch (error) {
          console.error(`Failed to fetch ${category} fields:`, error);
          // Fallback to localStorage on error
          const storedFields = getStoredCategoryFields(category);
          return { category, fields: storedFields };
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true
    });
  };

  // Function to get fields for a specific category from the current data
  const getCategoryFields = (category: FieldCategory): CustomField[] => {
    const categoryData = customFieldCategories.find(c => c.category === category);
    console.log(`Getting fields for ${category}:`, categoryData?.fields || []);
    return categoryData?.fields || [];
  };

  // Data for customer fields (for backward compatibility)
  const customFields = getCategoryFields("Customer");
  const isLoading = isLoadingCategories;
  const error = categoriesError;

  // Mutation to update a category's fields
  const { mutateAsync: updateCategoryFields, isPending: isUpdatingCategory } = useMutation({
    mutationFn: async (categoryData: CustomFieldCategory) => {
      try {
        console.log(`Updating fields for ${categoryData.category}:`, categoryData.fields);
        // Try to update via API
        const response = await saveCustomFieldCategory(categoryData)
          .catch((error) => {
            console.log(`API update failed for ${categoryData.category}, falling back to localStorage`, error);
            storeCategoryFields(categoryData);
            return categoryData;
          });
        
        console.log(`Update response for ${categoryData.category}:`, response);
        
        // Always update localStorage as cache
        storeCategoryFields(response);
        return response;
      } catch (error) {
        console.error("Failed to update category fields:", error);
        // Fallback to local storage on error
        storeCategoryFields(categoryData);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Invalidate both the all categories query and the specific category query
      queryClient.invalidateQueries({ queryKey: ["customFieldCategories"] });
      queryClient.invalidateQueries({ queryKey: ["customFieldCategory", data.category] });
      toast.success(`${data.category} fields updated successfully`);
    },
    onError: (error, variables) => {
      toast.error(`Failed to update ${variables.category} fields on the server`);
      console.error(error);
    }
  });

  // For backward compatibility
  const updateCustomFields = async (fields: CustomField[]) => {
    return updateCategoryFields({ category: "Customer", fields });
  };

  return {
    // New categorized API
    customFieldCategories,
    isLoadingCategories,
    getCategoryFields,
    updateCategoryFields,
    isUpdatingCategory,
    useCategoryFields,
    refetchCategories,
    
    // Original API (for backward compatibility)
    customFields,
    isLoading,
    isUpdating: isUpdatingCategory,
    error,
    updateCustomFields
  };
}
