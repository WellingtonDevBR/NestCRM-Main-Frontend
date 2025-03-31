
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Line } from "lucide-react";
import { PredictionMapping } from "@/domain/models/predictionMapping";
import { formatModelFieldValue } from "@/utils/fieldMappingUtils";

interface CustomerEngagementSectionProps {
  customerData: any;
  mappingData: PredictionMapping | null;
  loading: boolean;
  getFieldValue: (modelField: string) => any;
}

const CustomerEngagementSection: React.FC<CustomerEngagementSectionProps> = ({
  customerData,
  mappingData,
  loading,
  getFieldValue
}) => {
  if (loading) {
    return (
      <Card className="mt-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Customer Engagement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Define engagement metrics to display - using model field names
  const engagementMetrics = [
    { label: "Usage Frequency", field: "Usage_Frequency", icon: "📊" },
    { label: "Days Since Last Interaction", field: "Days_Since_Last_Interaction", icon: "🗓️" },
    { label: "Support Tickets", field: "Support_Calls", icon: "🎫" },
    { label: "Payment Delay (Average)", field: "Payment_Delay", icon: "💲" },
    { label: "Total Spend", field: "Total_Spend", icon: "💰" },
  ];

  // Count how many metrics we have values for
  const availableMetrics = engagementMetrics.filter(metric => 
    getFieldValue(metric.field) !== undefined
  );

  // If no metrics are available, return a message
  if (availableMetrics.length === 0) {
    return (
      <Card className="mt-6 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Customer Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No engagement data available for this customer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Customer Engagement & Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {availableMetrics.map(metric => {
            const value = getFieldValue(metric.field);
            if (value === undefined) return null;
            
            return (
              <div 
                key={metric.field} 
                className="flex flex-col p-3 border rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{metric.icon}</span>
                  <span className="text-sm font-medium text-muted-foreground">{metric.label}</span>
                </div>
                <span className="text-lg font-semibold">
                  {formatModelFieldValue(value, metric.field)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerEngagementSection;
