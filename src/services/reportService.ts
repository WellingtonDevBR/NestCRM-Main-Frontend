
import { Report } from "@/domain/models/report";

// Mock data for reports
const mockReports: Report[] = [
  {
    id: "report-001",
    name: "Monthly Sales Report",
    description: "Overview of sales performance for the current month with comparisons to previous periods",
    type: "sales",
    createdAt: "2023-10-15T08:00:00Z",
    lastRunAt: "2024-01-02T09:30:00Z",
    scheduled: true,
    scheduledFrequency: "monthly",
    creator: "Admin User"
  },
  {
    id: "report-002",
    name: "Customer Acquisition Report",
    description: "Analysis of new customer acquisition channels and conversion rates",
    type: "customer",
    createdAt: "2023-11-05T14:20:00Z",
    lastRunAt: "2023-12-28T10:15:00Z",
    scheduled: false,
    creator: "Marketing Team"
  },
  {
    id: "report-003",
    name: "Payment Processing Report",
    description: "Summary of payment processing status, methods, and failures",
    type: "payment",
    createdAt: "2023-12-10T11:45:00Z",
    lastRunAt: "2024-01-10T16:00:00Z",
    scheduled: true,
    scheduledFrequency: "weekly",
    creator: "Finance Team"
  },
  {
    id: "report-004",
    name: "Customer Engagement Analysis",
    description: "Metrics on customer activity, engagement levels, and interaction frequency",
    type: "activity",
    createdAt: "2024-01-05T09:30:00Z",
    lastRunAt: "2024-01-12T14:20:00Z",
    scheduled: true,
    scheduledFrequency: "weekly",
    creator: "Customer Success Team"
  },
  {
    id: "report-005",
    name: "Quarterly Business Review",
    description: "Comprehensive review of business performance metrics for the quarter",
    type: "custom",
    createdAt: "2023-09-30T16:15:00Z",
    lastRunAt: "2024-01-05T11:30:00Z",
    scheduled: true,
    scheduledFrequency: "quarterly",
    creator: "Executive Team"
  }
];

export const reportService = {
  // Fetch all reports
  getReports: async (): Promise<Report[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReports), 800);
    });
  },

  // Get report by ID
  getReportById: async (id: string): Promise<Report | undefined> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockReports.find(report => report.id === id);
        resolve(report);
      }, 500);
    });
  },

  // Run report (mock function)
  runReport: async (id: string): Promise<boolean> => {
    // Simulate API delay for running report
    return new Promise((resolve) => {
      setTimeout(() => {
        const reportExists = mockReports.some(report => report.id === id);
        resolve(reportExists);
      }, 1500);
    });
  }
};
