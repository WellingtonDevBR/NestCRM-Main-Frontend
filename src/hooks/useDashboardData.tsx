
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
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboardData"],
    queryFn: async () => {
      return api.get<DashboardData>("/data");
    },
    // Refresh data every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  });
}
