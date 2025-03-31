
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { format, parseISO, isValid } from "date-fns";
import { CustomerPrediction } from "@/domain/models/prediction";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PredictionDetailDialogProps {
  prediction: CustomerPrediction | null;
  isOpen: boolean;
  onClose: () => void;
}

const PredictionDetailDialog: React.FC<PredictionDetailDialogProps> = ({
  prediction,
  isOpen,
  onClose
}) => {
  if (!prediction) return null;

  // Format date safely
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, "MMM d, yyyy 'at' h:mm a") : "Unknown";
    } catch (error) {
      return "Unknown";
    }
  };

  const percentage = Math.round(prediction.churnProbability * 100);
  
  // Determine risk level color and label
  const getRiskLevel = () => {
    if (percentage >= 70) return { label: "High Risk", color: "bg-red-100 text-red-800 hover:bg-red-200" };
    if (percentage >= 40) return { label: "Medium Risk", color: "bg-amber-100 text-amber-800 hover:bg-amber-200" };
    return { label: "Low Risk", color: "bg-green-100 text-green-800 hover:bg-green-200" };
  };
  
  const riskInfo = getRiskLevel();
  
  // Get progress bar color
  const getProgressColorClass = () => {
    if (percentage >= 70) return "bg-red-600";
    if (percentage >= 40) return "bg-amber-600";
    return "bg-green-600";
  };

  // Mock customer details to display along with the prediction data
  const mockCustomerData = {
    engagementScore: Math.round(Math.random() * 100),
    accountAge: Math.floor(Math.random() * 36) + 1, // 1-36 months
    lastActive: format(new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), "MMM d, yyyy"),
    revenue: `$${(Math.random() * 10000).toFixed(2)}`,
    subscription: ["Basic", "Premium", "Enterprise"][Math.floor(Math.random() * 3)],
    tickets: Math.floor(Math.random() * 10),
    interactions: Math.floor(Math.random() * 50) + 5
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Customer Prediction: {prediction.customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Prediction Overview Card */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Churn Prediction</h3>
            
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                Prediction Date: {formatDate(prediction.predictionDate)}
              </span>
              <Badge className={riskInfo.color}>{riskInfo.label}</Badge>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span>Churn Probability</span>
                <span className="font-bold">{percentage}%</span>
              </div>
              <Progress 
                value={percentage} 
                className={`h-2 bg-secondary ${getProgressColorClass()} [&>div]:${getProgressColorClass()}`}
              />
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Prediction Model</h4>
              <div className="text-sm text-muted-foreground">
                <div>Model: {prediction.modelName}</div>
                <div>Model ID: {prediction.modelId}</div>
              </div>
            </div>
          </div>

          {/* Customer Info Card */}
          <div className="rounded-lg border p-4 shadow-sm">
            <h3 className="font-medium text-lg mb-2">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span>{prediction.customerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Engagement Score:</span>
                <span>{mockCustomerData.engagementScore}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Age:</span>
                <span>{mockCustomerData.accountAge} months</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Active:</span>
                <span>{mockCustomerData.lastActive}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Revenue:</span>
                <span>{mockCustomerData.revenue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subscription:</span>
                <span>{mockCustomerData.subscription}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Factors Table */}
        <div className="mt-6 rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Key Contributing Factors</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Factor</TableHead>
                <TableHead className="text-right">Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prediction.factorsContributing.map((factor, index) => (
                <TableRow key={index}>
                  <TableCell>{factor.factor}</TableCell>
                  <TableCell className="text-right">{Math.round(factor.impact * 100)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Customer Engagement and Support History */}
        <div className="mt-6 rounded-lg border p-4 shadow-sm">
          <h3 className="font-medium text-lg mb-4">Customer Engagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Support History</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Tickets:</span>
                  <span>{mockCustomerData.tickets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Resolution Time:</span>
                  <span>{Math.floor(Math.random() * 48) + 2} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Satisfaction Score:</span>
                  <span>{Math.floor(Math.random() * 3) + 3}/5</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Usage Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Interactions:</span>
                  <span>{mockCustomerData.interactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feature Adoption:</span>
                  <span>{Math.round(Math.random() * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Recent Activity Trend:</span>
                  <span>{["Increasing", "Decreasing", "Stable"][Math.floor(Math.random() * 3)]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailDialog;
