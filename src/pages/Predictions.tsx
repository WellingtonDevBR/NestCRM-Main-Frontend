
import React, { useState, useEffect } from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import PredictionScoreCard from "@/components/predictions/PredictionScoreCard";
import ModelCard from "@/components/predictions/ModelCard";
import PredictionDetailDialog from "@/components/predictions/PredictionDetailDialog";
import { CustomerPrediction } from "@/domain/models/prediction";

const ITEMS_PER_PAGE = 6; // Number of cards per page

const Predictions: React.FC = () => {
  const { models, predictions, isLoading, error } = usePredictions();
  
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // For detail dialog
  const [selectedPrediction, setSelectedPrediction] = useState<CustomerPrediction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // For tabs and filtered data
  const [activeTab, setActiveTab] = useState("all");
  const [highRiskCustomers, setHighRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [mediumRiskCustomers, setMediumRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [lowRiskCustomers, setLowRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [sortedPredictions, setSortedPredictions] = useState<CustomerPrediction[]>([]);
  const [currentItems, setCurrentItems] = useState<CustomerPrediction[]>([]);
  const [pageCount, setPageCount] = useState(0);

  // Process predictions when data changes
  useEffect(() => {
    if (predictions.length > 0) {
      // Sort predictions by churn probability (highest first)
      const sorted = [...predictions].sort((a, b) => 
        b.churnProbability - a.churnProbability
      );
      setSortedPredictions(sorted);
      
      // High-risk customers (>70% churn probability)
      setHighRiskCustomers(sorted.filter(p => p.churnProbability >= 0.7));
      
      // Medium-risk customers (40-70% churn probability)
      setMediumRiskCustomers(sorted.filter(p => 
        p.churnProbability >= 0.4 && p.churnProbability < 0.7
      ));
      
      // Low-risk customers (<40% churn probability)
      setLowRiskCustomers(sorted.filter(p => p.churnProbability < 0.4));
    }
  }, [predictions]);

  // Update current items and page count when tab or page changes
  useEffect(() => {
    let items: CustomerPrediction[] = [];
    let count = 0;
    
    switch(activeTab) {
      case "high-risk":
        items = paginatePredictions(highRiskCustomers);
        count = getPageCount(highRiskCustomers.length);
        break;
      case "medium-risk":
        items = paginatePredictions(mediumRiskCustomers);
        count = getPageCount(mediumRiskCustomers.length);
        break;
      case "low-risk":
        items = paginatePredictions(lowRiskCustomers);
        count = getPageCount(lowRiskCustomers.length);
        break;
      default:
        items = paginatePredictions(sortedPredictions);
        count = getPageCount(sortedPredictions.length);
    }
    
    setCurrentItems(items);
    setPageCount(count);
  }, [activeTab, currentPage, highRiskCustomers, mediumRiskCustomers, lowRiskCustomers, sortedPredictions]);

  const openPredictionDetails = (prediction: CustomerPrediction) => {
    setSelectedPrediction(prediction);
    setDialogOpen(true);
  };

  const closePredictionDetails = () => {
    setDialogOpen(false);
  };

  // Pagination functions
  const paginatePredictions = (predictionsList: CustomerPrediction[]) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return predictionsList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const getPageCount = (totalItems: number) => {
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Predictions</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-60" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Error loading predictions</h3>
        <p className="text-red-700">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Predictions</h1>
      
      {/* Models section */}
      <Card>
        <CardHeader>
          <CardTitle>Prediction Models</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Customer predictions section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Churn Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="all">All Customers ({predictions.length})</TabsTrigger>
              <TabsTrigger value="high-risk">
                High Risk ({highRiskCustomers.length})
              </TabsTrigger>
              <TabsTrigger value="medium-risk">
                Medium Risk ({mediumRiskCustomers.length})
              </TabsTrigger>
              <TabsTrigger value="low-risk">
                Low Risk ({lowRiskCustomers.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                    onClick={() => openPredictionDetails(prediction)}
                  />
                ))}
              </div>
              
              {pageCount > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
            
            <TabsContent value="high-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                    onClick={() => openPredictionDetails(prediction)}
                  />
                ))}
              </div>
              
              {pageCount > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
            
            <TabsContent value="medium-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                    onClick={() => openPredictionDetails(prediction)}
                  />
                ))}
              </div>
              
              {pageCount > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
            
            <TabsContent value="low-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentItems.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                    onClick={() => openPredictionDetails(prediction)}
                  />
                ))}
              </div>
              
              {pageCount > 1 && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} />
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
                        <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
