
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerRisk } from '@/hooks/useCustomerRisk';
import { useCustomFields } from '@/hooks/useCustomFields';
import SearchAndFilterBar from './SearchAndFilterBar';
import CustomerRiskRow from './CustomerRiskRow';
import { Skeleton } from "@/components/ui/skeleton";

const CustomerList: React.FC = () => {
  // Using the targeted query to only fetch Customer specific fields
  const { data: customerFieldsData, isLoading: isLoadingFields } = 
    useCustomFields().useCategoryFields("Customer");
  
  // Get the customer custom fields
  const customFields = customerFieldsData?.fields || [];
  
  const {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  } = useCustomerRisk();

  // Default column visibility - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Update column visibility when custom fields change
  useEffect(() => {
    if (customFields?.length) {
      const customFieldsVisibility: Record<string, boolean> = {};
      customFields.forEach(field => {
        customFieldsVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldsVisibility);
    }
  }, [customFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoadingFields) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSearch={handleSearch}
          onFilterChange={handleStatusFilter}
          columnVisibility={columnVisibility}
          onToggleColumn={toggleColumnVisibility}
          customFields={customFields || []}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {/* Display custom field columns - only display if column visibility is enabled */}
                {customFields?.map(field => 
                  columnVisibility[field.key] && (
                    <th key={field.key} className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {field.label}
                    </th>
                  )
                )}
                
                <th className="py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="py-4 text-center text-muted-foreground">
                    No customers found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <CustomerRiskRow 
                    key={customer.id} 
                    customer={customer} 
                    columnVisibility={columnVisibility}
                    customFields={customFields || []}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
