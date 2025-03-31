
import React from "react";
import { CustomerPrediction } from "@/domain/models/prediction";
import PredictionScoreCard from "@/components/predictions/PredictionScoreCard";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface PredictionsListProps {
  predictions: CustomerPrediction[];
  currentPage: number;
  pageCount: number;
  setCurrentPage: (page: number) => void;
  onSelectPrediction: (prediction: CustomerPrediction) => void;
}

const PredictionsList: React.FC<PredictionsListProps> = ({
  predictions,
  currentPage,
  pageCount,
  setCurrentPage,
  onSelectPrediction
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {predictions.map(prediction => (
          <PredictionScoreCard
            key={prediction.id}
            probability={prediction.churnProbability}
            customerName={prediction.customerName}
            factorsContributing={prediction.factorsContributing}
            onClick={() => onSelectPrediction(prediction)}
          />
        ))}
      </div>
      
      {pageCount > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))} />
              </PaginationItem>
            )}
            
            {Array.from({ length: pageCount }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink 
                  isActive={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {currentPage < pageCount && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount))} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
};

export default PredictionsList;
