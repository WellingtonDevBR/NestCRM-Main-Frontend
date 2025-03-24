
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
import { toast } from "sonner";
import { Customer } from "@/domain/models/customer";
import SearchInput from "./SearchInput";
import ColumnVisibilityDropdown from "./ColumnVisibilityDropdown";
import CustomerTableRow from "./CustomerTableRow";
import CustomerTableSkeleton from "./CustomerTableSkeleton";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

interface CustomersTableProps {
  onEdit: (customer: Customer) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({ onEdit }) => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    name: true,
    email: true,
    phone: true,
    createdAt: true
  });

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

  // Find all unique custom fields from all customers
  const customFields = React.useMemo(() => {
    if (!customers?.length) return [];
    
    const allFields = new Set<string>();
    customers.forEach(customer => {
      if (customer.customFields) {
        Object.keys(customer.customFields).forEach(key => {
          allFields.add(key);
        });
      }
    });
    
    return Array.from(allFields);
  }, [customers]);

  // Initialize column visibility for custom fields
  useEffect(() => {
    const initialCustomFieldVisibility: Record<string, boolean> = {};
    customFields.forEach(field => {
      // If not in state yet, default to visible
      if (columnVisibility[field] === undefined) {
        initialCustomFieldVisibility[field] = true;
      }
    });
    
    if (Object.keys(initialCustomFieldVisibility).length > 0) {
      setColumnVisibility(prev => ({
        ...prev,
        ...initialCustomFieldVisibility
      }));
    }
  }, [customFields, columnVisibility]);

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
  
  // Get visible columns
  const visibleColumns = Object.entries(columnVisibility)
    .filter(([_, isVisible]) => isVisible)
    .map(([column]) => column);

  // Filter custom fields to only display the visible ones
  const visibleCustomFields = customFields.filter(field => columnVisibility[field]);

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500">Error loading customers</div>
        <div className="text-sm text-muted-foreground">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
        <ColumnVisibilityDropdown 
          columnVisibility={columnVisibility}
          customFields={customFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.name && <TableHead>Name</TableHead>}
              {columnVisibility.email && <TableHead>Email</TableHead>}
              {columnVisibility.phone && <TableHead>Phone</TableHead>}
              {visibleCustomFields.map(field => (
                <TableHead key={field}>{field}</TableHead>
              ))}
              {columnVisibility.createdAt && <TableHead>Created</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CustomerTableSkeleton 
                visibleColumns={columnVisibility}
                visibleCustomFields={visibleCustomFields}
              />
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={visibleColumns.length + 1} 
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
                  visibleCustomFields={visibleCustomFields}
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
