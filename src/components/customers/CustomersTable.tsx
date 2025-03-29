
import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomFields } from "@/hooks/useCustomFields";
import { toast } from "sonner";
import { Customer } from "@/domain/models/customer";
import SearchInput from "./SearchInput";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import CustomerTableRow from "./CustomerTableRow";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomersTableProps {
  onEdit: (customer: Customer) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ onEdit }) => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  
  // Use the new categorized API to get Customer fields specifically
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

  useEffect(() => {
    if (customers) {
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
      const customFieldVisibility: Record<string, boolean> = {};
      visibleCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
        <ColumnVisibilityDropdown 
          columnVisibility={columnVisibility}
          customFields={visibleCustomFields || []}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Render custom field headers dynamically */}
              {visibleCustomFields?.map(field => 
                columnVisibility[field.key] && (
                  <TableHead key={field.key}>{field.label}</TableHead>
                )
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} 
                  className="h-32 text-center"
                >
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <CustomerTableRow
                  key={customer.id}
                  customer={customer}
                  visibleColumns={columnVisibility}
                  customFields={customFields}
                  onEdit={onEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CustomersTable;
