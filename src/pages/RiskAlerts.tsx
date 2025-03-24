
import React from "react";
import { useRiskAlerts } from "@/hooks/useRiskAlerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AlertCard from "@/components/risk-alerts/AlertCard";
import { toast } from "sonner";

const RiskAlerts: React.FC = () => {
  const { 
    alerts, 
    alertsByStatus, 
    alertsBySeverity, 
    updateAlertStatus, 
    isLoading, 
    error 
  } = useRiskAlerts();

  const handleUpdateStatus = async (alertId: string, status: string) => {
    try {
      await updateAlertStatus({ alertId, status });
      
      // Show success toast
      const statusMessages = {
        acknowledged: "Alert acknowledged",
        resolved: "Alert marked as resolved",
        dismissed: "Alert dismissed"
      };
      
      toast.success(statusMessages[status as keyof typeof statusMessages] || "Status updated");
    } catch (error) {
      toast.error("Failed to update alert status");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Risk Alerts</h1>
        <div className="space-y-4">
          <Skeleton className="h-12 w-60" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error loading risk alerts</h3>
        <p className="text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Risk Alerts</h1>
      </div>
      
      {/* Status summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{alertsByStatus.new.length}</div>
            <div className="text-sm text-muted-foreground">New Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{alertsByStatus.acknowledged.length}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{alertsByStatus.resolved.length}</div>
            <div className="text-sm text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{alertsBySeverity.critical.length}</div>
            <div className="text-sm text-muted-foreground">Critical</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Alerts tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Alerts ({alerts.length})</TabsTrigger>
              <TabsTrigger value="new">New ({alertsByStatus.new.length})</TabsTrigger>
              <TabsTrigger value="acknowledged">In Progress ({alertsByStatus.acknowledged.length})</TabsTrigger>
              <TabsTrigger value="resolved">Resolved ({alertsByStatus.resolved.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alerts.map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alertsByStatus.new.map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
                {alertsByStatus.new.length === 0 && (
                  <div className="col-span-3 p-6 text-center text-muted-foreground">
                    No new alerts
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="acknowledged" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alertsByStatus.acknowledged.map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
                {alertsByStatus.acknowledged.length === 0 && (
                  <div className="col-span-3 p-6 text-center text-muted-foreground">
                    No alerts in progress
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="resolved" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alertsByStatus.resolved.map(alert => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
                {alertsByStatus.resolved.length === 0 && (
                  <div className="col-span-3 p-6 text-center text-muted-foreground">
                    No resolved alerts
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAlerts;
