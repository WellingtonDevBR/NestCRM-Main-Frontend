
import React from "react";

interface CustomerEngagementProps {
  supportData: {
    tickets: number;
    resolutionTime: number;
    satisfactionScore: number;
  };
  usageData: {
    interactions: number;
    featureAdoption: number;
    activityTrend: string;
  };
}

const CustomerEngagementSection: React.FC<CustomerEngagementProps> = ({
  supportData,
  usageData
}) => {
  return (
    <div className="mt-6 rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-4">Customer Engagement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Support History</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tickets:</span>
              <span>{supportData.tickets}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Resolution Time:</span>
              <span>{supportData.resolutionTime} hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Satisfaction Score:</span>
              <span>{supportData.satisfactionScore}/5</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Usage Metrics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Interactions:</span>
              <span>{usageData.interactions}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Feature Adoption:</span>
              <span>{usageData.featureAdoption}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recent Activity Trend:</span>
              <span>{usageData.activityTrend}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerEngagementSection;
