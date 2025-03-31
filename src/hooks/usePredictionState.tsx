
import { useState, useEffect } from 'react';
import { CustomerPrediction } from "@/domain/models/prediction";

const ITEMS_PER_PAGE = 6;

export function usePredictionState(predictions: CustomerPrediction[]) {
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  
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

  return {
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
  };
}
