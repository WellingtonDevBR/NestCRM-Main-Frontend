
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
  
  const [selectedPrediction, setSelectedPrediction] = useState<CustomerPrediction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const {
    currentPage,
    setCurrentPage,
    searchTerm,
    handleSearchChange,
    activeTab,
    highRiskCustomers,
    mediumRiskCustomers,
    lowRiskCustomers,
    sortedPredictions,
    filteredPredictions,
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
      
      <ModelsSection models={models} />
      
      <PredictionTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortedPredictions={sortedPredictions}
        highRiskCustomers={highRiskCustomers}
        mediumRiskCustomers={mediumRiskCustomers}
        lowRiskCustomers={lowRiskCustomers}
        filteredPredictions={filteredPredictions}
        currentItems={currentItems}
        currentPage={currentPage}
        pageCount={pageCount}
        setCurrentPage={setCurrentPage}
        onSelectPrediction={openPredictionDetails}
      />
      
      <PredictionDetailDialog 
        prediction={selectedPrediction}
        isOpen={dialogOpen}
        onClose={closePredictionDetails}
      />
    </div>
  );
};

export default Predictions;
