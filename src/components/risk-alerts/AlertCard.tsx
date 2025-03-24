
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskAlert } from "@/domain/models/riskAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CheckCircle, AlertCircle, Clock, XCircle } from "lucide-react";

interface AlertCardProps {
  alert: RiskAlert;
  onUpdateStatus: (alertId: string, status: RiskAlert['status']) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onUpdateStatus }) => {
  // Get alert type display text
  const getAlertTypeText = () => {
    switch (alert.alertType) {
      case "churn_risk":
        return "Churn Risk";
      case "activity_drop":
        return "Activity Drop";
      case "support_escalation":
        return "Support Escalation";
      case "payment_issue":
        return "Payment Issue";
      default:
        return alert.alertType;
    }
  };
  
  // Get severity badge color
  const getSeverityBadgeClass = () => {
    switch (alert.severity) {
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "medium":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "";
    }
  };
  
  // Get status icon
  const getStatusIcon = () => {
    switch (alert.status) {
      case "new":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "acknowledged":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "dismissed":
        return <XCircle className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon()}
              <Badge variant="outline" className={getSeverityBadgeClass()}>
                {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {getAlertTypeText()}
              </span>
            </div>
            <CardTitle className="text-base">{alert.customerName}</CardTitle>
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(alert.createdAt), "MMM d, yyyy")}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-sm pb-2">
        <p>{alert.description}</p>
        {alert.assignedTo && (
          <div className="mt-2 text-xs text-muted-foreground">
            Assigned to: {alert.assignedTo}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        {alert.status === "new" && (
          <>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={() => onUpdateStatus(alert.id, "acknowledged")}
            >
              Acknowledge
            </Button>
            <Button 
              size="sm" 
              variant="ghost"
              className="text-xs"
              onClick={() => onUpdateStatus(alert.id, "dismissed")}
            >
              Dismiss
            </Button>
          </>
        )}
        {alert.status === "acknowledged" && (
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs"
            onClick={() => onUpdateStatus(alert.id, "resolved")}
          >
            Mark Resolved
          </Button>
        )}
        {(alert.status === "resolved" || alert.status === "dismissed") && (
          <div className="text-xs text-muted-foreground">
            No actions available
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default AlertCard;
