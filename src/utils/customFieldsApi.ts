
import { CustomField } from "@/types/customer";
import { api } from "@/utils/api";

// API endpoints
const CUSTOM_FIELDS_ENDPOINT = "/settings/custom-fields";

/**
 * Fetch custom fields from the API
 * @returns Promise with the custom fields array
 */
export async function fetchCustomFields(): Promise<CustomField[]> {
  try {
    // The API returns the fields directly as an array
    const fields = await api.get<CustomField[]>(CUSTOM_FIELDS_ENDPOINT);
    return Array.isArray(fields) ? fields : [];
  } catch (error) {
    console.error("Failed to fetch custom fields from API:", error);
    throw error;
  }
}

/**
 * Save custom fields to the API
 * @param fields Array of custom fields to save
 * @returns Promise with the saved custom fields
 */
export async function saveCustomFields(fields: CustomField[]): Promise<CustomField[]> {
  try {
    // The API expects a payload with a 'fields' property
    const payload = { fields };
    const response = await api.post<CustomField[]>(CUSTOM_FIELDS_ENDPOINT, payload);
    return Array.isArray(response) ? response : fields;
  } catch (error) {
    console.error("Failed to save custom fields to API:", error);
    throw error;
  }
}
