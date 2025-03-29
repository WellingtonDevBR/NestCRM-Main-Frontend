
import { CustomField, CustomFieldCategory, FIELD_CATEGORIES } from "@/domain/models/customField";

// Keys for localStorage
const CUSTOM_FIELDS_KEY = "nestcrm-custom-fields";
const CATEGORY_FIELDS_PREFIX = "nestcrm-category-fields-";

// Store all custom field categories
export function storeCustomFields(categories: CustomFieldCategory[]): void {
  try {
    localStorage.setItem(CUSTOM_FIELDS_KEY, JSON.stringify(categories));
  } catch (error) {
    console.error("Error storing custom fields in localStorage:", error);
  }
}

// Get all stored custom field categories
export function getStoredCustomFields(): CustomFieldCategory[] {
  try {
    const stored = localStorage.getItem(CUSTOM_FIELDS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error retrieving custom fields from localStorage:", error);
    return [];
  }
}

// Store a specific category's fields
export function storeCategoryFields(categoryData: CustomFieldCategory): void {
  try {
    // Store in the category-specific key
    const key = `${CATEGORY_FIELDS_PREFIX}${categoryData.category}`;
    localStorage.setItem(key, JSON.stringify(categoryData.fields));
    
    // Also update the main custom fields storage
    const allCategories = getStoredCustomFields();
    const existingIndex = allCategories.findIndex(c => c.category === categoryData.category);
    
    if (existingIndex >= 0) {
      allCategories[existingIndex] = categoryData;
    } else {
      allCategories.push(categoryData);
    }
    
    storeCustomFields(allCategories);
  } catch (error) {
    console.error(`Error storing ${categoryData.category} fields in localStorage:`, error);
  }
}

// Get stored fields for a specific category
export function getStoredCategoryFields(category: string): CustomField[] {
  try {
    const key = `${CATEGORY_FIELDS_PREFIX}${category}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Fallback to checking the main storage
    const allCategories = getStoredCustomFields();
    const categoryData = allCategories.find(c => c.category === category);
    return categoryData?.fields || [];
  } catch (error) {
    console.error(`Error retrieving ${category} fields from localStorage:`, error);
    return [];
  }
}

// Retrieve a store item by key
export function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Store an item by key
export function storeItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
}

// Remove an item by key
export function removeStoredItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
}
