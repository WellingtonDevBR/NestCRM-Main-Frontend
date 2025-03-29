
import React, { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomFields } from "@/hooks/useCustomFields";
import { toast } from "sonner";
import { Customer } from "@/domain/models/customer";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomersTableContainerProps {
  onEdit: (customer: Customer) => void;
}

const CustomersTableContainer: React.FC<CustomersTableContainerProps> = ({ onEdit }) => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  
  // Use the categorized API to get Customer fields
  const { data: customerFieldsData, isLoading: isLoadingFields } = 
    useCustomFields().useCategoryFields("Customer");
  
  // Get the customer custom fields
  const customFields = customerFieldsData?.fields || [];
  
  // Filter out association fields that are not marked for use
  const visibleCustomFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Process customers data when it's loaded
  useEffect(() => {
    if (customers) {
      console.log("CustomersTable - All customers:", customers);
      
      setFilteredCustomers(
        customers.filter((customer) => {
          const searchTermLower = searchTerm.toLowerCase();
          // Safely check name and email properties
          const nameMatch = customer.name ? customer.name.toLowerCase().includes(searchTermLower) : false;
          const emailMatch = customer.email ? customer.email.toLowerCase().includes(searchTermLower) : false;
          
          // Check custom fields too if needed
          let customFieldMatch = false;
          if (customer.customFields && searchTerm) {
            customFieldMatch = Object.values(customer.customFields).some(value => 
              value && String(value).toLowerCase().includes(searchTermLower)
            );
          }
          
          return searchTerm === "" || nameMatch || emailMatch || customFieldMatch;
        })
      );
    }
  }, [customers, searchTerm]);

  // Initialize column visibility for custom fields from settings
  useEffect(() => {
    if (visibleCustomFields?.length) {
      console.log("CustomersTable - Setting up column visibility for fields:", visibleCustomFields);
      
      const customFieldVisibility: Record<string, boolean> = {};
      visibleCustomFields.forEach(field => {
        // Use field.key as the key for column visibility
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
      console.log("CustomersTable - Initial column visibility:", customFieldVisibility);
    }
  }, [visibleCustomFields]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete);
        toast.success("Customer deleted successfully");
      } catch (error) {
        toast.error("Failed to delete customer");
        console.error("Delete error:", error);
      }
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500">Error loading customers</div>
        <div className="text-sm text-muted-foreground">{error.message}</div>
      </div>
    );
  }

  if (isLoading || isLoadingFields) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  console.log("CustomersTable - Filtered customers:", filteredCustomers);
  console.log("CustomersTable - Column visibility:", columnVisibility);

  return (
    <TableHeader 
      searchTerm={searchTerm}
      onSearch={handleSearch}
      columnVisibility={columnVisibility}
      customFields={visibleCustomFields}
      onToggleColumn={toggleColumnVisibility}
      filteredCustomers={filteredCustomers}
      onEdit={onEdit}
      onDelete={handleDelete}
    >
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </TableHeader>
  );
};

export default CustomersTableContainer;
