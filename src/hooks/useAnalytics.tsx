
import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export function useAnalytics() {
  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ["analyticsDashboard"],
    queryFn: analyticsService.getAnalyticsDashboard,
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });

  // Default empty analytics data if still loading
  const analytics = data || {
    kpiMetrics: [],
    churnRateOverTime: [],
    customerSegmentation: [],
    revenueByCustomerTier: []
  };

  return {
    analytics,
    isLoading,
    error
  };
}
