
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/reportService";
import { Report, ReportType } from "@/domain/models/report";

export const useReports = () => {
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: reportService.getReports,
  });

  // Group reports by type for easier filtering
  const reportsByType = reports.reduce((acc, report) => {
    if (!acc[report.type]) {
      acc[report.type] = [];
    }
    acc[report.type].push(report);
    return acc;
  }, {} as Record<ReportType, Report[]>);

  // Ensure all report types exist in the grouping, even if empty
  const reportTypes: ReportType[] = ['sales', 'customer', 'payment', 'activity', 'custom'];
  reportTypes.forEach(type => {
    if (!reportsByType[type]) {
      reportsByType[type] = [];
    }
  });

  // Run a report
  const queryClient = useQueryClient();
  const { mutateAsync: runReport, isPending: isRunning } = useMutation({
    mutationFn: (reportId: string) => reportService.runReport(reportId),
    onSuccess: () => {
      // Invalidate reports query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  return {
    reports,
    reportsByType,
    isLoading,
    error,
    runReport,
    isRunning,
  };
};

export const useReportById = (id: string) => {
  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", id],
    queryFn: () => reportService.getReportById(id),
    enabled: !!id,
  });

  return {
    report,
    isLoading,
    error,
  };
};
