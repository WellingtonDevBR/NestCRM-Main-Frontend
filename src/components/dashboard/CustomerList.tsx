
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCustomerRisk } from '@/hooks/useCustomerRisk';
import SearchAndFilterBar from './SearchAndFilterBar';
import CustomerRiskRow from './CustomerRiskRow';

const CustomerList: React.FC = () => {
  const {
    searchTerm,
    filterStatus,
    filteredCustomers,
    handleSearch,
    handleStatusFilter
  } = useCustomerRisk();

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <SearchAndFilterBar
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSearch={handleSearch}
          onFilterChange={handleStatusFilter}
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Industry</th>
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk Score</th>
                <th className="py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCustomers.map((customer) => (
                <CustomerRiskRow key={customer.id} customer={customer} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
