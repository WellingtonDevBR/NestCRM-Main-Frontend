
import { AnalyticsDashboard } from "@/domain/models/analytics";

// Mock data for analytics dashboard
const mockAnalyticsData: AnalyticsDashboard = {
  kpiMetrics: [
    { name: "Total Customers", value: 1248 },
    { name: "Active Users", value: 987 },
    { name: "Churn Rate", value: 4.3 },
    { name: "Customer Satisfaction", value: 8.7 }
  ],
  churnRateOverTime: [
    {
      name: "Churn Rate",
      data: [
        { date: "Jan 2023", value: 5.2 },
        { date: "Feb 2023", value: 5.0 },
        { date: "Mar 2023", value: 4.8 },
        { date: "Apr 2023", value: 5.1 },
        { date: "May 2023", value: 4.7 },
        { date: "Jun 2023", value: 4.5 },
        { date: "Jul 2023", value: 4.6 },
        { date: "Aug 2023", value: 4.4 },
        { date: "Sep 2023", value: 4.5 },
        { date: "Oct 2023", value: 4.2 },
        { date: "Nov 2023", value: 4.0 },
        { date: "Dec 2023", value: 3.8 },
        { date: "Jan 2024", value: 4.1 },
        { date: "Feb 2024", value: 4.3 },
        { date: "Mar 2024", value: 4.2 }
      ]
    },
    {
      name: "Industry Average",
      data: [
        { date: "Jan 2023", value: 6.8 },
        { date: "Feb 2023", value: 6.7 },
        { date: "Mar 2023", value: 6.9 },
        { date: "Apr 2023", value: 6.8 },
        { date: "May 2023", value: 6.7 },
        { date: "Jun 2023", value: 6.5 },
        { date: "Jul 2023", value: 6.6 },
        { date: "Aug 2023", value: 6.4 },
        { date: "Sep 2023", value: 6.3 },
        { date: "Oct 2023", value: 6.2 },
        { date: "Nov 2023", value: 6.1 },
        { date: "Dec 2023", value: 6.0 },
        { date: "Jan 2024", value: 6.2 },
        { date: "Feb 2024", value: 6.3 },
        { date: "Mar 2024", value: 6.1 }
      ]
    }
  ],
  customerSegmentation: [
    { segment: "Enterprise", count: 124, percentage: 9.9 },
    { segment: "Mid-Market", count: 348, percentage: 27.9 },
    { segment: "Small Business", count: 576, percentage: 46.2 },
    { segment: "Startup", count: 200, percentage: 16.0 }
  ],
  revenueByCustomerTier: [
    { tier: "Enterprise", value: 1250000 },
    { tier: "Mid-Market", value: 875000 },
    { tier: "Small Business", value: 420000 },
    { tier: "Startup", value: 125000 }
  ]
};

export const analyticsService = {
  // Fetch analytics dashboard data
  getAnalyticsDashboard: async (): Promise<AnalyticsDashboard> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAnalyticsData), 1000);
    });
  }
};
