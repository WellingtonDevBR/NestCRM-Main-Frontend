
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PredictionMapping } from "@/domain/models/predictionMapping";
import { formatCustomerField } from "../detailUtils";

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
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Customer Engagement & Support History</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  const supportTickets = getFieldValue("Support_Calls");
  const paymentDelays = getFieldValue("Payment_Delay");
  const usageFrequency = getFieldValue("Usage_Frequency");
  const daysSinceLastUse = getFieldValue("Days_Since_Last_Interaction");

  // Only show section if we have at least one of these values
  if (!supportTickets && !paymentDelays && !usageFrequency && !daysSinceLastUse) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Customer Engagement & Support History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Engagement Metric</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Risk Assessment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supportTickets !== undefined && (
              <TableRow>
                <TableCell className="font-medium">Support Tickets</TableCell>
                <TableCell>{formatCustomerField(supportTickets)}</TableCell>
                <TableCell>
                  <RiskIndicator value={supportTickets} threshold={3} inverse={false} />
                </TableCell>
              </TableRow>
            )}
            
            {paymentDelays !== undefined && (
              <TableRow>
                <TableCell className="font-medium">Payment Delays</TableCell>
                <TableCell>{formatCustomerField(paymentDelays)}</TableCell>
                <TableCell>
                  <RiskIndicator value={paymentDelays} threshold={15} inverse={false} />
                </TableCell>
              </TableRow>
            )}
            
            {usageFrequency !== undefined && (
              <TableRow>
                <TableCell className="font-medium">Usage Frequency</TableCell>
                <TableCell>{formatCustomerField(usageFrequency)}</TableCell>
                <TableCell>
                  <RiskIndicator value={usageFrequency} threshold={30} inverse={true} />
                </TableCell>
              </TableRow>
            )}
            
            {daysSinceLastUse !== undefined && (
              <TableRow>
                <TableCell className="font-medium">Days Since Last Usage</TableCell>
                <TableCell>{formatCustomerField(daysSinceLastUse)}</TableCell>
                <TableCell>
                  <RiskIndicator value={daysSinceLastUse} threshold={14} inverse={false} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

interface RiskIndicatorProps {
  value: number;
  threshold: number;
  inverse: boolean;
}

// Risk indicator component
const RiskIndicator: React.FC<RiskIndicatorProps> = ({ value, threshold, inverse }) => {
  // For inverse metrics (like usage frequency), higher is better
  // For regular metrics (like support tickets), lower is better
  const isHighRisk = inverse 
    ? value < threshold 
    : value > threshold;
  
  const isMediumRisk = inverse
    ? value < threshold * 1.5 && value >= threshold
    : value > threshold * 0.5 && value <= threshold;

  return (
    <div className="flex items-center gap-2">
      <div 
        className={`h-3 w-3 rounded-full ${
          isHighRisk 
            ? 'bg-red-500' 
            : isMediumRisk 
              ? 'bg-amber-500' 
              : 'bg-green-500'
        }`}
      />
      <span>
        {isHighRisk 
          ? 'High Risk' 
          : isMediumRisk 
            ? 'Medium Risk' 
            : 'Low Risk'
        }
      </span>
    </div>
  );
};

export default CustomerEngagementSection;
