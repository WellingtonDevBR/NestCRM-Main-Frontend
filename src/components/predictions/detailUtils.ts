
import { format, parseISO, isValid } from "date-fns";

// Format date safely
export const formatDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy 'at' h:mm a") : "Unknown";
  } catch (error) {
    return "Unknown";
  }
};

// Generate mock customer data for display
export const generateMockCustomerData = () => {
  return {
    engagementScore: Math.round(Math.random() * 100),
    accountAge: Math.floor(Math.random() * 36) + 1, // 1-36 months
    lastActive: format(new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), "MMM d, yyyy"),
    revenue: `$${(Math.random() * 10000).toFixed(2)}`,
    subscription: ["Basic", "Premium", "Enterprise"][Math.floor(Math.random() * 3)],
    tickets: Math.floor(Math.random() * 10),
    interactions: Math.floor(Math.random() * 50) + 5,
    supportData: {
      tickets: Math.floor(Math.random() * 10),
      resolutionTime: Math.floor(Math.random() * 48) + 2,
      satisfactionScore: Math.floor(Math.random() * 3) + 3
    },
    usageData: {
      interactions: Math.floor(Math.random() * 50) + 5,
      featureAdoption: Math.round(Math.random() * 100),
      activityTrend: ["Increasing", "Decreasing", "Stable"][Math.floor(Math.random() * 3)]
    }
  };
};
