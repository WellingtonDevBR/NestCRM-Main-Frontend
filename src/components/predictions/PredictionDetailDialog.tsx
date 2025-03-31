
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { CustomerPrediction } from "@/domain/models/prediction";
import ChurnPredictionCard from "./detail/ChurnPredictionCard";
import CustomerInfoCard from "./detail/CustomerInfoCard";
import ContributingFactorsTable from "./detail/ContributingFactorsTable";
import CustomerEngagementSection from "./detail/CustomerEngagementSection";
import { generateMockCustomerData } from "./detailUtils";

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

  // Generate mock data for the customer
  const mockCustomerData = generateMockCustomerData();

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
          <ChurnPredictionCard prediction={prediction} />

          {/* Customer Info Card */}
          <CustomerInfoCard 
            customerId={prediction.customerId} 
            mockData={mockCustomerData} 
          />
        </div>

        {/* Key Factors Table */}
        <ContributingFactorsTable factors={prediction.factorsContributing} />
        
        {/* Customer Engagement and Support History */}
        <CustomerEngagementSection 
          supportData={mockCustomerData.supportData}
          usageData={mockCustomerData.usageData}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailDialog;
