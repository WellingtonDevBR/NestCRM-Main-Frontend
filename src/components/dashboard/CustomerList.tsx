
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample customer data with churn risk scores
const CUSTOMERS = [
  { id: 1, name: 'Acme Corp', email: 'contact@acmecorp.com', industry: 'Technology', value: '$12,500', riskScore: 87, status: 'High Risk' },
  { id: 2, name: 'Globex', email: 'info@globex.com', industry: 'Finance', value: '$28,900', riskScore: 62, status: 'Medium Risk' },
  { id: 3, name: 'Initech', email: 'support@initech.com', industry: 'Healthcare', value: '$8,300', riskScore: 34, status: 'Low Risk' },
  { id: 4, name: 'Umbrella Corp', email: 'contact@umbrella.com', industry: 'Biotech', value: '$45,200', riskScore: 91, status: 'High Risk' },
  { id: 5, name: 'Massive Dynamic', email: 'info@massivedynamic.com', industry: 'Research', value: '$32,100', riskScore: 28, status: 'Low Risk' },
  { id: 6, name: 'Stark Industries', email: 'sales@stark.com', industry: 'Manufacturing', value: '$67,800', riskScore: 53, status: 'Medium Risk' },
  { id: 7, name: 'Wayne Enterprises', email: 'info@wayne.com', industry: 'Technology', value: '$54,600', riskScore: 18, status: 'Low Risk' },
  { id: 8, name: 'Cyberdyne Systems', email: 'support@cyberdyne.com', industry: 'AI', value: '$21,300', riskScore: 76, status: 'High Risk' },
  { id: 9, name: 'Soylent Corp', email: 'info@soylent.com', industry: 'Food', value: '$15,700', riskScore: 48, status: 'Medium Risk' },
  { id: 10, name: 'Weyland-Yutani', email: 'contact@weyland.com', industry: 'Aerospace', value: '$87,400', riskScore: 82, status: 'High Risk' },
];

const CustomerList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState(CUSTOMERS);
  const [filterStatus, setFilterStatus] = useState('All');

  // Handle search and filtering
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    let results = CUSTOMERS;
    
    // Filter by search term
    if (term) {
      results = results.filter(customer => 
        customer.name.toLowerCase().includes(term.toLowerCase()) ||
        customer.email.toLowerCase().includes(term.toLowerCase()) ||
        customer.industry.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'All') {
      results = results.filter(customer => customer.status === filterStatus);
    }
    
    setFilteredCustomers(results);
  };

  // Handle status filter
  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
    
    let results = CUSTOMERS;
    
    // Apply search term
    if (searchTerm) {
      results = results.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.industry.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (status !== 'All') {
      results = results.filter(customer => customer.status === status);
    }
    
    setFilteredCustomers(results);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'High Risk':
        return 'bg-red-100 text-red-700';
      case 'Medium Risk':
        return 'bg-amber-100 text-amber-700';
      case 'Low Risk':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg">At-Risk Customers</CardTitle>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search customers..." 
              value={searchTerm} 
              onChange={handleSearch}
              className="w-full sm:w-64"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {filterStatus === 'All' ? 'All Risks' : filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusFilter('All')}>
                  All Risks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('High Risk')}>
                  High Risk
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('Medium Risk')}>
                  Medium Risk
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter('Low Risk')}>
                  Low Risk
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 text-sm">
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-muted-foreground text-xs">{customer.email}</div>
                    </div>
                  </td>
                  <td className="py-4 text-sm">{customer.industry}</td>
                  <td className="py-4 text-sm font-medium">{customer.value}</td>
                  <td className="py-4 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          customer.riskScore >= 70 ? 'bg-red-600' : 
                          customer.riskScore >= 40 ? 'bg-amber-500' : 'bg-green-500'
                        }`} 
                        style={{ width: `${customer.riskScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-muted-foreground">{customer.riskScore}/100</span>
                  </td>
                  <td className="py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-right">
                    <Button variant="ghost" size="sm">Contact</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerList;
