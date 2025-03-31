
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerPrediction } from "@/domain/models/prediction";
import PredictionsList from "./PredictionsList";
import PredictionSearch from "./PredictionSearch";

interface PredictionTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortedPredictions: CustomerPrediction[];
  highRiskCustomers: CustomerPrediction[];
  mediumRiskCustomers: CustomerPrediction[];
  lowRiskCustomers: CustomerPrediction[];
  filteredPredictions: CustomerPrediction[];
  currentItems: CustomerPrediction[];
  currentPage: number;
  pageCount: number;
  setCurrentPage: (page: number) => void;
  onSelectPrediction: (prediction: CustomerPrediction) => void;
}

const PredictionTabs: React.FC<PredictionTabsProps> = ({
  activeTab,
  onTabChange,
  searchTerm,
  onSearchChange,
  sortedPredictions,
  highRiskCustomers,
  mediumRiskCustomers,
  lowRiskCustomers,
  filteredPredictions,
  currentItems,
  currentPage,
  pageCount,
  setCurrentPage,
  onSelectPrediction
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Churn Predictions</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Add search input */}
        <PredictionSearch 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        
        <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
          <TabsList>
            <TabsTrigger value="all">All Customers ({sortedPredictions.length})</TabsTrigger>
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
            <PredictionsList 
              predictions={currentItems}
              currentPage={currentPage}
              pageCount={pageCount}
              setCurrentPage={setCurrentPage}
              onSelectPrediction={onSelectPrediction}
            />
          </TabsContent>
          
          <TabsContent value="high-risk" className="mt-4">
            <PredictionsList 
              predictions={currentItems}
              currentPage={currentPage}
              pageCount={pageCount}
              setCurrentPage={setCurrentPage}
              onSelectPrediction={onSelectPrediction}
            />
          </TabsContent>
          
          <TabsContent value="medium-risk" className="mt-4">
            <PredictionsList 
              predictions={currentItems}
              currentPage={currentPage}
              pageCount={pageCount}
              setCurrentPage={setCurrentPage}
              onSelectPrediction={onSelectPrediction}
            />
          </TabsContent>
          
          <TabsContent value="low-risk" className="mt-4">
            <PredictionsList 
              predictions={currentItems}
              currentPage={currentPage}
              pageCount={pageCount}
              setCurrentPage={setCurrentPage}
              onSelectPrediction={onSelectPrediction}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictionTabs;
