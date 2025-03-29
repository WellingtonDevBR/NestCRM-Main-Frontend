
import { useState } from "react";
import { CustomField, CustomFieldCategory, FIELD_CATEGORIES } from "@/domain/models/customField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  fetchCustomFields, 
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

  // Query for all categories
  const { 
    data: customFieldCategories = [], 
    isLoading: isLoadingCategories, 
    error: categoriesError,
    isFetching: isFetchingCategories
  } = useQuery({
    queryKey: ["customFieldCategories"],
    queryFn: async () => {
      try {
        console.log("Fetching all custom field categories...");
        // Try to fetch from API first
        const categories = await fetchCustomFields();
        console.log("Fetched categories from API:", categories);
        
        // Update localStorage as a cache
        if (Array.isArray(categories) && categories.length > 0) {
          storeCustomFields(categories);
        }
        
        return categories;
      } catch (error) {
        console.error("Failed to fetch custom field categories:", error);
        // Fallback to localStorage on error
        const storedCategories = getStoredCustomFields();
        console.log("Using stored categories from localStorage:", storedCategories);
        return storedCategories;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true
  });

  // Function to fetch a specific category
  const useCategoryFields = (category: typeof FIELD_CATEGORIES[number]) => {
    return useQuery({
      queryKey: ["customFieldCategory", category],
      queryFn: async () => {
        try {
          console.log(`Fetching fields for ${category} category...`);
          // Try to fetch from API first
          const fields = await fetchCategoryFields(category);
          console.log(`Fetched ${category} fields from API:`, fields);
          
          // Update localStorage as a cache
          if (fields && Array.isArray(fields)) {
            const categoryData = { category, fields };
            storeCategoryFields(categoryData);
          }
          
          return { category, fields };
        } catch (error) {
          console.error(`Failed to fetch ${category} fields:`, error);
          // Fallback to localStorage on error
          const storedFields = getStoredCategoryFields(category);
          console.log(`Using stored ${category} fields from localStorage:`, storedFields);
          return { category, fields: storedFields };
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true
    });
  };

  // Function to get fields for a specific category from the current data
  const getCategoryFields = (category: typeof FIELD_CATEGORIES[number]): CustomField[] => {
    const categoryData = customFieldCategories.find(c => c.category === category);
    return categoryData?.fields || [];
  };

  // For backward compatibility
  const customFields = getCategoryFields("Customer");
  const isLoading = isLoadingCategories;
  const error = categoriesError;

  // Mutation to update a category's fields
  const { mutateAsync: updateCategoryFields, isPending: isUpdatingCategory } = useMutation({
    mutationFn: async (categoryData: CustomFieldCategory) => {
      try {
        console.log(`Updating fields for ${categoryData.category} category...`);
        // Try to update via API - sending the complete category object with all fields
        const response = await saveCustomFieldCategory(categoryData);
        console.log(`Updated ${categoryData.category} fields on API:`, response);
        
        // Create the updated category object
        const updatedCategory = {
          category: categoryData.category,
          fields: response
        };
        
        // Always update localStorage as cache
        storeCategoryFields(updatedCategory);
        return updatedCategory;
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
    
    // Original API (for backward compatibility)
    customFields,
    isLoading,
    isUpdating: isUpdatingCategory,
    error,
    updateCustomFields
  };
}
