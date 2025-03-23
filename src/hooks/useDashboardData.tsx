
import { useQuery } from "@tanstack/react-query";
import { api } from "@/utils/api";

// Types for dashboard data
interface CustomerRisk {
  id: string;
  name: string;
  company: string;
  email: string;
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  lastActivity: string;
}

interface DashboardData {
  metrics: {
    totalCustomers: number;
    customerGrowth: number;
    churnRate: number;
    churnRateChange: number;
    atRiskCount: number;
    atRiskPercentage: number;
  };
  atRiskCustomers: CustomerRisk[];
  user?: {
    id: string;
    name: string;
    email: string;
    company: string;
  };
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      try {
        // This API call now serves dual purpose:
        // 1. Get dashboard data
        // 2. Validate user authentication (will fail with 401 if not authenticated)
        return api.get<DashboardData>("/data");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // If this fails, it means user is not authenticated or there's a server error
        throw error;
      }
    },
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
    // Add proper error handling
    meta: {
      onError: (error: Error) => {
        console.error("Dashboard data fetch error:", error);
      }
    }
  });
}
