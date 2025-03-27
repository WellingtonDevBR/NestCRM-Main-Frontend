
import { CustomField, CustomFieldCategory, FIELD_CATEGORIES } from "@/domain/models/customField";
import { api } from "@/utils/api";

// API endpoints
const CUSTOM_FIELDS_ENDPOINT = "/settings/custom-fields";

/**
 * Fetch all custom fields from the API
 * @returns Promise with the custom fields categories array
 */
export async function fetchCustomFields(): Promise<CustomFieldCategory[]> {
  try {
    // The API returns an object with categories as keys and arrays of fields as values
    const response = await api.get<Record<string, CustomField[]>>(CUSTOM_FIELDS_ENDPOINT);
    console.log("API fetchCustomFields response:", response);
    
    // Transform the response format into an array of categories
    if (response && typeof response === 'object') {
      const categories: CustomFieldCategory[] = [];
      
      // For each category in the response, create a CustomFieldCategory object
      for (const categoryName of FIELD_CATEGORIES) {
        const fields = response[categoryName] || [];
        categories.push({
          category: categoryName,
          fields: fields
        });
      }
      
      return categories;
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch custom fields from API:", error);
    throw error;
  }
}

/**
 * Fetch custom fields for a specific category directly from the API
 * @param category The category to fetch fields for
 * @returns Promise with the custom fields for the requested category
 */
export async function fetchCategoryFieldsFromApi(category: string): Promise<CustomField[]> {
  try {
    // Use query parameter to fetch only the requested category
    const endpoint = `${CUSTOM_FIELDS_ENDPOINT}?category=${encodeURIComponent(category)}`;
    const fields = await api.get<CustomField[]>(endpoint);
    console.log(`API fetchCategoryFieldsFromApi(${category}) response:`, fields);
    
    return Array.isArray(fields) ? fields : [];
  } catch (error) {
    console.error(`Failed to fetch ${category} fields from API:`, error);
    throw error;
  }
}

/**
 * Fetch custom fields for a specific category
 * @param category The category to fetch fields for
 * @returns Promise with the custom fields array for the requested category
 */
export async function fetchCategoryFields(category: string): Promise<CustomField[]> {
  try {
    return await fetchCategoryFieldsFromApi(category);
  } catch (error) {
    console.error(`Failed to fetch ${category} fields:`, error);
    throw error;
  }
}

/**
 * Save custom fields for a specific category to the API
 * @param categoryData The category and fields data to save
 * @returns Promise with the saved custom fields
 */
export async function saveCustomFieldCategory(categoryData: CustomFieldCategory): Promise<CustomField[]> {
  try {
    const { category, fields } = categoryData;
    console.log(`Saving custom fields for ${category}:`, fields);
    
    // Format for the API - send the entire category object with all fields
    const response = await api.post<CustomField[]>(CUSTOM_FIELDS_ENDPOINT, {
      category,
      fields
    });
    
    return Array.isArray(response) ? response : [];
  } catch (error) {
    console.error("Failed to save custom fields to API:", error);
    throw error;
  }
}
