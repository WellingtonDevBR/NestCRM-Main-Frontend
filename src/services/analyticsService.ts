
import { AnalyticsDashboard } from "@/domain/models/analytics";

// Mock dashboard data
const mockAnalyticsData: AnalyticsDashboard = {
  kpiMetrics: [
    { name: "Total Customers", value: 1248 },
    { name: "New Customers", value: 127 },
    { name: "Churn Rate", value: 4.3 },
    { name: "Customer Satisfaction", value: 8.7 }
  ],
  churnRateOverTime: [
    {
      name: "Churn Rate",
      data: [
        { date: "Jan 2023", value: 5.2 },
        { date: "Feb 2023", value: 4.8 },
        { date: "Mar 2023", value: 4.9 },
        { date: "Apr 2023", value: 5.1 },
        { date: "May 2023", value: 4.7 },
        { date: "Jun 2023", value: 4.5 },
        { date: "Jul 2023", value: 4.3 },
        { date: "Aug 2023", value: 4.3 }
      ]
    },
    {
      name: "Industry Average",
      data: [
        { date: "Jan 2023", value: 5.5 },
        { date: "Feb 2023", value: 5.4 },
        { date: "Mar 2023", value: 5.3 },
        { date: "Apr 2023", value: 5.3 },
        { date: "May 2023", value: 5.2 },
        { date: "Jun 2023", value: 5.1 },
        { date: "Jul 2023", value: 5.0 },
        { date: "Aug 2023", value: 4.9 }
      ]
    }
  ],
  customerSegmentation: [
    { segment: "Enterprise", count: 187, percentage: 15 },
    { segment: "Mid-Market", count: 346, percentage: 28 },
    { segment: "SMB", count: 521, percentage: 42 },
    { segment: "Startup", count: 194, percentage: 15 }
  ],
  revenueByCustomerTier: [
    { tier: "Enterprise", value: 1250000 },
    { tier: "Mid-Market", value: 750000 },
    { tier: "SMB", value: 500000 },
    { tier: "Startup", value: 125000 }
  ]
};

export const analyticsService = {
  // Fetch analytics dashboard data
  getAnalyticsDashboard: async (): Promise<AnalyticsDashboard> => {
    // This would be replaced with an actual API call
    return mockAnalyticsData;
  }
};
