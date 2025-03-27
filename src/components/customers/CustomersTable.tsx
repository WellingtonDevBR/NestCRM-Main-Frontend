
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
import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomersTableProps {
  onEdit: (customer: Customer) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ onEdit }) => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const { customFields, isLoading: isLoadingFields } = useCustomFields();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (customers) {
      setFilteredCustomers(
        customers.filter((customer) => 
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [customers, searchTerm]);

  // Initialize column visibility for custom fields from settings
  useEffect(() => {
    if (customFields?.length) {
      const customFieldVisibility: Record<string, boolean> = {};
      customFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [customFields]);

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
          customFields={customFields || []}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Render custom field headers dynamically */}
              {customFields?.map(field => 
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
                <TableRow key={customer.id} className="hover:bg-gray-50">
                  {/* Render custom field values if present */}
                  {customFields?.map(field => 
                    columnVisibility[field.key] && (
                      <TableCell key={field.key}>
                        {customer.customFields && field.key in customer.customFields
                          ? String(customer.customFields[field.key])
                          : '—'}
                      </TableCell>
                    )
                  )}
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(customer)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
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
