
import React from "react";

interface CustomerInfoCardProps {
  customerId: string;
  mockData: {
    engagementScore: number;
    accountAge: number;
    lastActive: string;
    revenue: string;
    subscription: string;
  };
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ customerId, mockData }) => {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-2">Customer Information</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Customer ID:</span>
          <span>{customerId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Engagement Score:</span>
          <span>{mockData.engagementScore}/100</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Account Age:</span>
          <span>{mockData.accountAge} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Last Active:</span>
          <span>{mockData.lastActive}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Revenue:</span>
          <span>{mockData.revenue}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subscription:</span>
          <span>{mockData.subscription}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
