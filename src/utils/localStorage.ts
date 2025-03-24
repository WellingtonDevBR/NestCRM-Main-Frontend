
import { CustomField } from "@/domain/models/customer";

// Storage keys
export const STORAGE_KEYS = {
  CUSTOM_FIELDS: "customer_custom_fields",
};

/**
 * Get stored custom fields from localStorage
 * @returns Array of custom fields
 */
export function getStoredCustomFields(): CustomField[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading custom fields from localStorage:", error);
    return [];
  }
}

/**
 * Store custom fields in localStorage
 * @param fields Array of custom fields to store
 */
export function storeCustomFields(fields: CustomField[]): void {
  try {
    // Validate fields before storage
    const validFields = fields.filter(field => field.key && field.label);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(validFields));
  } catch (error) {
    console.error("Error storing custom fields in localStorage:", error);
    throw new Error("Failed to save custom fields to localStorage");
  }
}
