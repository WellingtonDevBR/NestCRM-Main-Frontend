
import React, { useState } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { usePredictionState } from "@/hooks/usePredictionState";
import { CustomerPrediction } from "@/domain/models/prediction";
import PredictionDetailDialog from "@/components/predictions/PredictionDetailDialog";
import ModelsSection from "@/components/predictions/ModelsSection";
import PredictionTabs from "@/components/predictions/PredictionTabs";
import LoadingState from "@/components/predictions/LoadingState";
import ErrorState from "@/components/predictions/ErrorState";

const Predictions: React.FC = () => {
  const { models, predictions, isLoading, error } = usePredictions();
  
  // For detail dialog
  const [selectedPrediction, setSelectedPrediction] = useState<CustomerPrediction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Get prediction state from custom hook
  const {
    currentPage,
    setCurrentPage,
    activeTab,
    highRiskCustomers,
    mediumRiskCustomers,
    lowRiskCustomers,
    sortedPredictions,
    currentItems,
    pageCount,
    handleTabChange
  } = usePredictionState(predictions);

  const openPredictionDetails = (prediction: CustomerPrediction) => {
    setSelectedPrediction(prediction);
    setDialogOpen(true);
  };

  const closePredictionDetails = () => {
    setDialogOpen(false);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error as Error} />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Predictions</h1>
      
      {/* Models section */}
      <ModelsSection models={models} />
      
      {/* Customer predictions section */}
      <PredictionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        sortedPredictions={sortedPredictions}
        highRiskCustomers={highRiskCustomers}
        mediumRiskCustomers={mediumRiskCustomers}
        lowRiskCustomers={lowRiskCustomers}
        currentItems={currentItems}
        currentPage={currentPage}
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
        onSelectPrediction={openPredictionDetails}
      />
      
      {/* Prediction Details Dialog */}
      <PredictionDetailDialog 
        prediction={selectedPrediction}
        isOpen={dialogOpen}
        onClose={closePredictionDetails}
      />
    </div>
  );
};

export default Predictions;
