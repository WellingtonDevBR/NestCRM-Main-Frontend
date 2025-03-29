
import { useState, useEffect } from 'react';
import { CustomerRiskData } from "@/domain/models/customerRisk";
import { customerRiskService } from "@/services/customerRiskService";
import { useCustomFields } from '@/hooks/useCustomFields';

export function useCustomerRisk() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [customers, setCustomers] = useState<CustomerRiskData[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<CustomerRiskData[]>([]);
  
  const { customFields } = useCustomFields();

  // Initialize customers
  useEffect(() => {
    const initialCustomers = customerRiskService.getCustomers();
    
    // Ensure each customer has a customFields object initialized
    const preparedCustomers = initialCustomers.map(customer => ({
      ...customer,
      customFields: customer.customFields || {}
    }));

    setCustomers(preparedCustomers);
    setFilteredCustomers(filterCustomers(preparedCustomers, searchTerm, filterStatus));
  }, []);

  // Update customers when custom fields change to ensure they have all fields initialized
  useEffect(() => {
    if (customFields?.length > 0 && customers.length > 0) {
      // Make sure each customer has entries for all custom fields, even if empty
      const updatedCustomers = customers.map(customer => {
        const updatedCustomFields = { ...customer.customFields };
        
        // Initialize any missing custom fields
        customFields.forEach(field => {
          if (updatedCustomFields[field.key] === undefined) {
            updatedCustomFields[field.key] = null;
          }
        });

        return {
          ...customer,
          customFields: updatedCustomFields
        };
      });
      
      setCustomers(updatedCustomers);
      setFilteredCustomers(filterCustomers(updatedCustomers, searchTerm, filterStatus));
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
      
      // Search filter - basic search by name or email
      const searchLower = term.toLowerCase();
      const nameMatch = customer.name?.toLowerCase().includes(searchLower) || false;
      const emailMatch = customer.email?.toLowerCase().includes(searchLower) || false;
      
      // Also search in custom fields
      let customFieldMatch = false;
      if (customer.customFields && term) {
        customFieldMatch = Object.values(customer.customFields).some(value => 
          value && String(value).toLowerCase().includes(searchLower)
        );
      }
      
      return statusMatch && (nameMatch || emailMatch || customFieldMatch || !term);
    });
  };

  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredCustomers(filterCustomers(customers, term, filterStatus));
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    setFilteredCustomers(filterCustomers(customers, searchTerm, status));
  };

  return {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  };
}
