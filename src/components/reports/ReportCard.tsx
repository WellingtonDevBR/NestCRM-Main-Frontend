
import React from "react";
import { FileText, BarChart2, Clock, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Report } from "@/domain/models/report";
import { formatDistanceToNow } from "date-fns";

interface ReportCardProps {
  report: Report;
  onRun: (reportId: string) => Promise<void>;
  isRunning: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onRun, isRunning }) => {
  // Get icon based on report type
  const getReportIcon = () => {
    switch (report.type) {
      case "sales":
      case "payment":
        return <BarChart2 className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-purple-500" />;
    }
  };
  
  // Format last run date
  const getLastRunText = () => {
    if (!report.lastRunAt) return "Never run";
    return `Last run ${formatDistanceToNow(new Date(report.lastRunAt), { addSuffix: true })}`;
  };
  
  // Get type badge color
  const getTypeBadgeColor = () => {
    switch (report.type) {
      case "sales":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "customer":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "payment":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "activity":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleRunClick = async () => {
    await onRun(report.id);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            {getReportIcon()}
            {report.name}
          </CardTitle>
          <Badge variant="outline" className={getTypeBadgeColor()}>
            {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4 mr-1" />
          <span>{getLastRunText()}</span>
        </div>
        
        {report.scheduled && (
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              Scheduled: {report.scheduledFrequency?.charAt(0).toUpperCase() + 
                report.scheduledFrequency?.slice(1)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-muted-foreground">
            Created by {report.creator}
          </div>
          <Button 
            size="sm" 
            onClick={handleRunClick}
            disabled={isRunning}
          >
            Run Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
