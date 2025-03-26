
import { CustomField, CustomFieldCategory } from "@/domain/models/customField";

// Storage keys
export const STORAGE_KEYS = {
  CUSTOM_FIELDS: "custom_fields_categories",
};

/**
 * Get stored custom fields from localStorage
 * @returns Array of custom field categories
 */
export function getStoredCustomFields(): CustomFieldCategory[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_FIELDS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading custom fields from localStorage:", error);
    return [];
  }
}

/**
 * Get stored custom fields for a specific category
 * @param category The category to retrieve fields for
 * @returns Array of custom fields for the specified category
 */
export function getStoredCategoryFields(category: string): CustomField[] {
  try {
    const categories = getStoredCustomFields();
    const categoryData = categories.find(c => c.category === category);
    return categoryData?.fields || [];
  } catch (error) {
    console.error(`Error reading ${category} fields from localStorage:`, error);
    return [];
  }
}

/**
 * Store custom field categories in localStorage
 * @param categories Array of custom field categories to store
 */
export function storeCustomFields(categories: CustomFieldCategory[]): void {
  try {
    // Validate categories before storage
    const validCategories = categories.filter(category => {
      return category.category && Array.isArray(category.fields);
    });
    
    localStorage.setItem(STORAGE_KEYS.CUSTOM_FIELDS, JSON.stringify(validCategories));
  } catch (error) {
    console.error("Error storing custom fields in localStorage:", error);
    throw new Error("Failed to save custom fields to localStorage");
  }
}

/**
 * Store or update a single category in localStorage
 * @param categoryData The category data to store
 */
export function storeCategoryFields(categoryData: CustomFieldCategory): void {
  try {
    const categories = getStoredCustomFields();
    const existingIndex = categories.findIndex(c => c.category === categoryData.category);
    
    if (existingIndex >= 0) {
      // Update existing category
      categories[existingIndex] = categoryData;
    } else {
      // Add new category
      categories.push(categoryData);
    }
    
    storeCustomFields(categories);
  } catch (error) {
    console.error(`Error storing ${categoryData.category} fields in localStorage:`, error);
    throw error;
  }
}
