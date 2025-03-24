
import { useState, useEffect } from 'react';
import { CustomerRiskData } from "@/domain/models/customerRisk";
import { customerRiskService } from "@/services/customerRiskService";
import { useCustomFields } from '@/hooks/useCustomFields';

export function useCustomerRisk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerRiskData[]>(
    customerRiskService.getCustomers()
  );
  
  const { customFields } = useCustomFields();

  // Update customers when custom fields change
  useEffect(() => {
    if (customFields?.length > 0) {
      const customers = customerRiskService.getCustomers();
      
      // Ensure each customer has a customFields object
      const updatedCustomers = customers.map(customer => ({
        ...customer,
        customFields: customer.customFields || {}
      }));
      
      setFilteredCustomers(
        filterCustomers(updatedCustomers, searchTerm, filterStatus)
      );
    }
  }, [customFields]);

  // Filter customers based on search term and status
  const filterCustomers = (
    customers: CustomerRiskData[],
    term: string,
    status: string
  ): CustomerRiskData[] => {
    return customers.filter(customer => {
      // Status filter
      const statusMatch = status === 'All' || customer.status === status;
      
      // Search filter
      const searchLower = term.toLowerCase();
      const nameMatch = customer.name.toLowerCase().includes(searchLower);
      const emailMatch = customer.email.toLowerCase().includes(searchLower);
      
      return statusMatch && (nameMatch || emailMatch);
    });
  };

  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredCustomers(
      filterCustomers(customerRiskService.getCustomers(), term, filterStatus)
    );
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setFilteredCustomers(
      filterCustomers(customerRiskService.getCustomers(), searchTerm, status)
    );
  };

  return {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  };
}
