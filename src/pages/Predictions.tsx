
import React from "react";
import { usePredictions } from "@/hooks/usePredictions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PredictionScoreCard from "@/components/predictions/PredictionScoreCard";
import ModelCard from "@/components/predictions/ModelCard";

const Predictions: React.FC = () => {
  const { models, predictions, isLoading, error } = usePredictions();

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

  // Sort predictions by churn probability (highest first)
  const sortedPredictions = [...predictions].sort((a, b) => 
    b.churnProbability - a.churnProbability
  );

  // High-risk customers (>70% churn probability)
  const highRiskCustomers = sortedPredictions.filter(p => p.churnProbability >= 0.7);
  
  // Medium-risk customers (40-70% churn probability)
  const mediumRiskCustomers = sortedPredictions.filter(p => 
    p.churnProbability >= 0.4 && p.churnProbability < 0.7
  );
  
  // Low-risk customers (<40% churn probability)
  const lowRiskCustomers = sortedPredictions.filter(p => p.churnProbability < 0.4);

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
          <Tabs defaultValue="all">
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
                {sortedPredictions.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="high-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {highRiskCustomers.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="medium-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mediumRiskCustomers.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="low-risk" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lowRiskCustomers.map(prediction => (
                  <PredictionScoreCard
                    key={prediction.id}
                    probability={prediction.churnProbability}
                    customerName={prediction.customerName}
                    factorsContributing={prediction.factorsContributing}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Predictions;
