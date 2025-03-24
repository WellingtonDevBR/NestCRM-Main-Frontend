
import { useState } from 'react';
import { CustomerRiskData } from "@/domain/models/customerRisk";
import { customerRiskService } from "@/services/customerRiskService";

export function useCustomerRisk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerRiskData[]>(
    customerRiskService.getCustomers()
  );

  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredCustomers(customerRiskService.searchCustomers(term, filterStatus));
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setFilteredCustomers(customerRiskService.searchCustomers(searchTerm, status));
  };

  return {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  };
}
