
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerRisk } from '@/hooks/useCustomerRisk';
import { useCustomFields } from '@/hooks/useCustomFields';
import SearchAndFilterBar from './SearchAndFilterBar';
import CustomerRiskRow from './CustomerRiskRow';
import { ColumnVisibility } from '@/domain/models/customerRisk';

const CustomerList: React.FC = () => {
  const { customFields, isLoading: isLoadingFields } = useCustomFields();
  
  const {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  } = useCustomerRisk();

  // Default column visibility
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    name: true,
    email: true,
    industry: true,
    value: true,
    riskScore: true,
    status: true
  });

  // Update column visibility when custom fields change
  useEffect(() => {
    if (customFields?.length) {
      const customFieldsVisibility: Record<string, boolean> = {};
      customFields.forEach(field => {
        customFieldsVisibility[field.key] = true;
      });
      
      setColumnVisibility(prev => ({
        ...prev,
        ...customFieldsVisibility
      }));
    }
  }, [customFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

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
          customFields={customFields}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                {columnVisibility.name && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                )}
                {columnVisibility.email && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                )}
                {columnVisibility.industry && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</th>
                )}
                {columnVisibility.value && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                )}
                {columnVisibility.riskScore && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Score</th>
                )}
                {columnVisibility.status && (
                  <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                )}
                
                {/* Display custom field columns */}
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
              {filteredCustomers.map((customer) => (
                <CustomerRiskRow 
                  key={customer.id} 
                  customer={customer} 
                  columnVisibility={columnVisibility}
                  customFields={customFields}
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
