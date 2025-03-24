
import React from "react";
import { Customer } from "@/domain/models/customer";
import CustomersTable from "@/components/customers/CustomersTable";
import CustomerDialog from "@/components/customers/CustomerDialog";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCustomFields } from "@/hooks/useCustomFields";

const Customers: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [currentCustomer, setCurrentCustomer] = React.useState<Customer | null>(null);
  const { isLoading: isLoadingCustomFields } = useCustomFields();

  const handleAddNewCustomer = () => {
    setCurrentCustomer(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer data</p>
        </div>
        <Button 
          onClick={handleAddNewCustomer}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Add New Customer
        </Button>
      </div>
      
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer Database</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable onEdit={handleEditCustomer} />
        </CardContent>
      </Card>
      
      <CustomerDialog 
        open={open} 
        onOpenChange={setOpen} 
        isEditMode={isEditMode}
        customer={currentCustomer}
      />
    </div>
  );
};

export default Customers;
