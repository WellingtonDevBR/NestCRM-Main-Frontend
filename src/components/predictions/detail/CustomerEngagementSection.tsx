
import React from "react";
import { CustomerLookupData } from "@/services/customerLookupService";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface CustomerEngagementProps {
  customerData: CustomerLookupData | null;
  loading: boolean;
}

const CustomerEngagementSection: React.FC<CustomerEngagementProps> = ({
  customerData,
  loading
}) => {
  // Extract or calculate values from customer data
  const supportTickets = customerData?.customFields?.support_tickets || 0;
  const usageDuration = customerData?.customFields?.tempo_de_uso || 0;
  const dependencies = customerData?.customFields?.dependentes || 0;
  const delays = customerData?.customFields?.atrasos || 0;
  const lastUsage = customerData?.customFields?.ultimo_uso || 0;
  
  // Calculate satisfaction score based on delays (inverse relationship)
  const calculateSatisfactionScore = (delays: number) => {
    const score = 5 - Math.min(Math.floor(delays / 10), 4);
    return `${score}/5`;
  };
  
  // Determine activity trend based on last usage
  const getActivityTrend = (lastUsage: number) => {
    if (lastUsage < 7) return { text: "Increasing", icon: <TrendingUp className="h-4 w-4 text-green-600 ml-1" /> };
    if (lastUsage > 20) return { text: "Decreasing", icon: <TrendingDown className="h-4 w-4 text-red-600 ml-1" /> };
    return { text: "Stable", icon: <Minus className="h-4 w-4 text-gray-600 ml-1" /> };
  };
  
  const activityTrend = getActivityTrend(lastUsage);
  
  // Calculate feature adoption percentage 
  const calculateFeatureAdoption = (usageDuration: number, dependencies: number) => {
    return Math.min(Math.round(60 + (usageDuration / 2) - (dependencies * 5)), 95);
  };

  return (
    <div className="mt-6 rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Customer Engagement</h3>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Support History</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Tickets:</span>
                <span>{supportTickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average Resolution Time:</span>
                <span>{Math.max(16, Math.round(delays / 2))} hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Satisfaction Score:</span>
                <span>{calculateSatisfactionScore(delays)}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Usage Metrics</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interactions:</span>
                <span>{Math.round(usageDuration * 2.5)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Feature Adoption:</span>
                <span>{calculateFeatureAdoption(usageDuration, dependencies)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recent Activity Trend:</span>
                <span className="flex items-center">
                  {activityTrend.text}
                  {activityTrend.icon}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerEngagementSection;
