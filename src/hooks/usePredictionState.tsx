
import { useState, useEffect } from 'react';
import { CustomerPrediction } from "@/domain/models/prediction";

const ITEMS_PER_PAGE = 6;

export function usePredictionState(predictions: CustomerPrediction[]) {
  // For pagination
  const [currentPage, setCurrentPage] = useState(1);
  
  // For search
  const [searchTerm, setSearchTerm] = useState("");
  
  // For tabs and filtered data
  const [activeTab, setActiveTab] = useState("all");
  const [highRiskCustomers, setHighRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [mediumRiskCustomers, setMediumRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [lowRiskCustomers, setLowRiskCustomers] = useState<CustomerPrediction[]>([]);
  const [sortedPredictions, setSortedPredictions] = useState<CustomerPrediction[]>([]);
  const [filteredPredictions, setFilteredPredictions] = useState<CustomerPrediction[]>([]);
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

  // Apply search filter across all predictions
  useEffect(() => {
    if (searchTerm.trim() === "") {
      // No search term, use unfiltered lists
      setFilteredPredictions(getActiveTabPredictions());
    } else {
      // Filter the active tab predictions by search term
      const predictions = getActiveTabPredictions();
      const filtered = predictions.filter(prediction => 
        prediction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prediction.customerId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPredictions(filtered);
    }

    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, activeTab, highRiskCustomers, mediumRiskCustomers, lowRiskCustomers, sortedPredictions]);

  // Update current items and page count when filtered predictions or page changes
  useEffect(() => {
    const items = paginatePredictions(filteredPredictions);
    const count = getPageCount(filteredPredictions.length);
    
    setCurrentItems(items);
    setPageCount(count);
  }, [filteredPredictions, currentPage]);

  // Get predictions based on active tab
  const getActiveTabPredictions = () => {
    switch(activeTab) {
      case "high-risk":
        return highRiskCustomers;
      case "medium-risk":
        return mediumRiskCustomers;
      case "low-risk":
        return lowRiskCustomers;
      default:
        return sortedPredictions;
    }
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

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return {
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
  };
}
