
import { formatDistance } from "date-fns";

/**
 * Formats a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

/**
 * Calculate time ago from now
 * @param dateString ISO date string
 * @returns Time ago string (e.g., "2 days ago")
 */
export const timeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (e) {
    console.error("Error calculating time ago:", e);
    return "Unknown";
  }
};

/**
 * Generate mock customer data for the UI when real data is not available
 * @returns Mock customer data
 */
export const generateMockCustomerData = () => {
  return {
    engagementScore: Math.floor(Math.random() * 40) + 60,
    accountAge: Math.floor(Math.random() * 24) + 6,
    lastActive: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    revenue: `$${(Math.random() * 10000 + 1000).toFixed(2)}`,
    subscription: ["Basic", "Standard", "Premium", "Enterprise"][Math.floor(Math.random() * 4)],
    
    // Additional mock data for customer engagement section
    supportData: {
      tickets: Math.floor(Math.random() * 10),
      resolutionTime: Math.floor(Math.random() * 40) + 5,
      satisfactionScore: Math.floor(Math.random() * 2) + 3
    },
    usageData: {
      interactions: Math.floor(Math.random() * 100) + 20,
      featureAdoption: Math.floor(Math.random() * 40) + 60,
      activityTrend: ["Increasing", "Stable", "Decreasing"][Math.floor(Math.random() * 3)]
    }
  };
};

/**
 * Format a customer field value for display
 * @param value The value to format
 * @returns Formatted value as string
 */
export const formatCustomerField = (value: any): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  
  if (typeof value === 'number') {
    // Format as number with no decimal places for integers, 
    // or 2 decimal places for floating point numbers
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (typeof value === 'object' && value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  return String(value);
};
