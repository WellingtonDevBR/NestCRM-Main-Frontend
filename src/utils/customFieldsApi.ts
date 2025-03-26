
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
    // The API returns categories with fields
    const categories = await api.get<CustomFieldCategory[]>(CUSTOM_FIELDS_ENDPOINT);
    return Array.isArray(categories) ? categories : [];
  } catch (error) {
    console.error("Failed to fetch custom fields from API:", error);
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
    const categories = await fetchCustomFields();
    const categoryData = categories.find(c => c.category === category);
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
    const response = await api.post<CustomFieldCategory>(CUSTOM_FIELDS_ENDPOINT, categoryData);
    return response;
  } catch (error) {
    console.error("Failed to save custom fields to API:", error);
    throw error;
  }
}
