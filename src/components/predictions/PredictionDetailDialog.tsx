
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { CustomerPrediction } from "@/domain/models/prediction";
import ChurnPredictionCard from "./detail/ChurnPredictionCard";
import CustomerInfoCard from "./detail/CustomerInfoCard";
import ContributingFactorsTable from "./detail/ContributingFactorsTable";
import CustomerEngagementSection from "./detail/CustomerEngagementSection";
import { useCustomerLookup } from "@/hooks/useCustomerLookup";
import { formatDate } from "./detailUtils";

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
  // Fetch customer data using the customer lookup hook
  const { customerData, isLoading } = useCustomerLookup(prediction);

  if (!prediction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold">
            Customer Prediction: {prediction.customerName || `Customer ${prediction.customerId}`}
          </DialogTitle>
          <DialogDescription>
            Analysis from {formatDate(prediction.predictionDate)} using {prediction.modelName} model
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Prediction Overview Card */}
          <ChurnPredictionCard prediction={prediction} />

          {/* Customer Info Card */}
          <CustomerInfoCard 
            customerId={prediction.customerId} 
            customerData={customerData}
            loading={isLoading}
          />
        </div>

        {/* Key Factors Table */}
        <ContributingFactorsTable factors={prediction.factorsContributing} />
        
        {/* Customer Engagement and Support History */}
        <CustomerEngagementSection 
          customerData={customerData}
          loading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailDialog;
