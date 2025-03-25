
import React, { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";
import ReportCard from "@/components/reports/ReportCard";
import { ReportType } from "@/domain/models/report";

const Reports: React.FC = () => {
  const { 
    reports, 
    reportsByType, 
    isLoading, 
    error,
    runReport,
    isRunning
  } = useReports();
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleRunReport = async (reportId: string) => {
    try {
      await runReport(reportId);
      toast.success("Report generated successfully");
    } catch (error) {
      toast.error("Failed to generate report");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
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
        <h3 className="text-lg font-medium text-red-800">Error loading reports</h3>
        <p className="text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Report
        </Button>
      </div>
      
      {/* Report summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reportsByType.sales.length}</div>
            <div className="text-sm text-muted-foreground">Sales Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reportsByType.customer.length}</div>
            <div className="text-sm text-muted-foreground">Customer Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reportsByType.payment.length}</div>
            <div className="text-sm text-muted-foreground">Payment Reports</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reportsByType.activity.length}</div>
            <div className="text-sm text-muted-foreground">Activity Reports</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Reports list with tabs */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Reports ({reports.length})</TabsTrigger>
              <TabsTrigger value="sales">Sales ({reportsByType.sales.length})</TabsTrigger>
              <TabsTrigger value="customer">Customer ({reportsByType.customer.length})</TabsTrigger>
              <TabsTrigger value="payment">Payment ({reportsByType.payment.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity ({reportsByType.activity.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map(report => (
                  <ReportCard 
                    key={report.id} 
                    report={report}
                    onRun={handleRunReport}
                    isRunning={isRunning}
                  />
                ))}
                {reports.length === 0 && (
                  <div className="col-span-3 p-12 flex flex-col items-center justify-center text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-1">No reports found</h3>
                    <p className="text-muted-foreground mb-4">Create your first report to get started.</p>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Report
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Create tabs for each report type */}
            {Object.entries(reportsByType).map(([type, reportsOfType]) => (
              <TabsContent key={type} value={type} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reportsOfType.map(report => (
                    <ReportCard 
                      key={report.id} 
                      report={report}
                      onRun={handleRunReport}
                      isRunning={isRunning}
                    />
                  ))}
                  {reportsOfType.length === 0 && (
                    <div className="col-span-3 p-12 flex flex-col items-center justify-center text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-1">No {type} reports found</h3>
                      <p className="text-muted-foreground mb-4">Create your first {type} report to get started.</p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Report
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
