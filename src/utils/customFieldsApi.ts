
import { CustomField, CustomFieldCategory } from "@/domain/models/customField";
import { api } from "@/utils/api";

// API endpoints
const CUSTOM_FIELDS_ENDPOINT = "/settings/custom-fields";

/**
 * Fetch custom fields from the API
 * @returns Promise with the custom fields categories array
 */
export async function fetchCustomFields(): Promise<CustomFieldCategory[]> {
  try {
    // The API returns categories with fields in a different format now
    const response = await api.get<Record<string, any[]>>(CUSTOM_FIELDS_ENDPOINT);
    
    // Transform the response to our internal format
    const categories: CustomFieldCategory[] = [];
    
    // Process each category in the response
    for (const [category, fields] of Object.entries(response)) {
      if (Array.isArray(fields)) {
        categories.push({
          category,
          fields: fields as CustomField[]
        });
      }
    }
    
    return categories;
  } catch (error) {
    console.error("Failed to fetch custom fields from API:", error);
    throw error;
  }
}

/**
 * Fetch custom fields for a specific category directly from the API
 * @param category The category to fetch fields for
 * @returns Promise with the custom fields category
 */
export async function fetchCategoryFieldsFromApi(category: string): Promise<CustomFieldCategory> {
  try {
    // Use query parameter to fetch only the requested category
    const endpoint = `${CUSTOM_FIELDS_ENDPOINT}?category=${encodeURIComponent(category)}`;
    const response = await api.get<Record<string, any[]>>(endpoint);
    
    // Handle the new response format
    const fields = response[category] || [];
    
    return {
      category,
      fields: fields as CustomField[]
    };
  } catch (error) {
    console.error(`Failed to fetch ${category} fields from API:`, error);
    throw error;
  }
}

/**
 * Fetch custom fields for a specific category from the API
 * @param category The category to fetch fields for
 * @returns Promise with the custom fields array for the requested category
 */
export async function fetchCategoryFields(category: string): Promise<CustomField[]> {
  try {
    const categoryData = await fetchCategoryFieldsFromApi(category);
    return categoryData?.fields || [];
  } catch (error) {
    console.error(`Failed to fetch ${category} fields from API:`, error);
    throw error;
  }
}

/**
 * Save custom fields to the API
 * @param categoryData The category with fields to save
 * @returns Promise with the saved custom fields category
 */
export async function saveCustomFieldCategory(categoryData: CustomFieldCategory): Promise<CustomFieldCategory> {
  try {
    // Transform to the format expected by the API
    const payload = {
      [categoryData.category]: categoryData.fields
    };
    
    const response = await api.post<Record<string, CustomField[]>>(CUSTOM_FIELDS_ENDPOINT, payload);
    
    // Transform the response back to our internal format
    return {
      category: categoryData.category,
      fields: response[categoryData.category] || []
    };
  } catch (error) {
    console.error("Failed to save custom fields to API:", error);
    throw error;
  }
}
