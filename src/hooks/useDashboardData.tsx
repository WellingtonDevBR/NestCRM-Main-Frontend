
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
      // The API call will handle 404 "Invalid tenant or subdomain" errors
      // and redirect to the main site
      return api.get<DashboardData>("/status");
    },
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
    // Error handling is managed by the API utility
    // We don't need special handling here as the API utility will redirect
    // for "Invalid tenant or subdomain" errors
    retry: (failureCount, error) => {
      // Don't retry for invalid tenant errors (these are handled by the API utility)
      if (error instanceof Error && error.message === "Invalid tenant or subdomain") {
        return false;
      }
      // For other errors, retry a few times
      return failureCount < 3;
    }
  });
}
