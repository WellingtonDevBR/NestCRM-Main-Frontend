
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
import { formatDate } from "./detailUtils";
import { useCustomerLookup } from "@/hooks/useCustomerLookup";
import { usePredictionMapping } from "@/hooks/usePredictionMapping";
import { useFieldMappedCustomerData } from "@/hooks/useFieldMappedCustomerData";

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
  // Get raw customer data
  const { customerData, isLoading: isLoadingCustomer } = useCustomerLookup(prediction);
  
  // Get field mappings
  const { mappingData, isLoading: isLoadingMappings } = usePredictionMapping();
  
  // Get field-mapped customer data
  const { 
    mappedCustomerData, 
    isLoading: isLoadingMappedData,
    getFieldValue 
  } = useFieldMappedCustomerData(prediction);
  
  const isLoading = isLoadingCustomer || isLoadingMappings || isLoadingMappedData;

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
            mappingData={mappingData}
            loading={isLoading}
            getFieldValue={getFieldValue}
          />
        </div>

        {/* Key Factors Table */}
        <ContributingFactorsTable factors={prediction.factorsContributing} />
        
        {/* Customer Engagement and Support History */}
        <CustomerEngagementSection 
          customerData={customerData}
          mappingData={mappingData}
          loading={isLoading}
          getFieldValue={getFieldValue}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PredictionDetailDialog;
