
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { riskAlertService } from "@/services/riskAlertService";
import { RiskAlert } from "@/domain/models/riskAlert";

export function useRiskAlerts() {
  const queryClient = useQueryClient();

  // Get all risk alerts
  const {
    data: alerts = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ["riskAlerts"],
    queryFn: riskAlertService.getRiskAlerts
  });

  // Get new alerts
  const {
    data: newAlerts = []
  } = useQuery({
    queryKey: ["riskAlerts", "new"],
    queryFn: () => riskAlertService.getAlertsByStatus("new")
  });

  // Update alert status
  const { mutateAsync: updateAlertStatus } = useMutation({
    mutationFn: ({ 
      alertId, 
      status, 
      assignedTo 
    }: { 
      alertId: string; 
      status: RiskAlert['status']; 
      assignedTo?: string 
    }) => {
      return riskAlertService.updateAlertStatus(alertId, status, assignedTo);
    },
    onSuccess: () => {
      // Invalidate relevant queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["riskAlerts"] });
    }
  });

  // Filter alerts by status
  const alertsByStatus = {
    new: alerts.filter(alert => alert.status === "new"),
    acknowledged: alerts.filter(alert => alert.status === "acknowledged"),
    resolved: alerts.filter(alert => alert.status === "resolved"),
    dismissed: alerts.filter(alert => alert.status === "dismissed")
  };

  // Filter alerts by severity
  const alertsBySeverity = {
    critical: alerts.filter(alert => alert.severity === "critical"),
    high: alerts.filter(alert => alert.severity === "high"),
    medium: alerts.filter(alert => alert.severity === "medium"),
    low: alerts.filter(alert => alert.severity === "low")
  };

  return {
    alerts,
    newAlerts,
    alertsByStatus,
    alertsBySeverity,
    updateAlertStatus,
    isLoading,
    error
  };
}

export function useCustomerRiskAlerts(customerId: string) {
  return useQuery({
    queryKey: ["customerRiskAlerts", customerId],
    queryFn: () => riskAlertService.getAlertsByCustomerId(customerId),
    enabled: !!customerId
  });
}
