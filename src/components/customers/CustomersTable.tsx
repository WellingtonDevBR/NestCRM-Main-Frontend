import React, { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash, Settings } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Customer } from "@/domain/models/customer";

interface CustomersTableProps {
  onEdit: (customer: any) => void;
}

// Define column type
type ColumnVisibility = {
  [key: string]: boolean;
};

const CustomersTable: React.FC<CustomersTableProps> = ({ onEdit }) => {
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
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
    const initialCustomFieldVisibility: ColumnVisibility = {};
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
  
  // Get visible columns
  const visibleColumns = Object.entries(columnVisibility)
    .filter(([_, isVisible]) => isVisible)
    .map(([column]) => column);

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500">Error loading customers</div>
        <div className="text-sm text-muted-foreground">{error.message}</div>
      </div>
    );
  }

  // Filter custom fields to only display the visible ones
  const visibleCustomFields = customFields.filter(field => columnVisibility[field]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              <Settings className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.name}
                onCheckedChange={() => toggleColumnVisibility('name')}
              >
                Name
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.email}
                onCheckedChange={() => toggleColumnVisibility('email')}
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.phone}
                onCheckedChange={() => toggleColumnVisibility('phone')}
              >
                Phone
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.createdAt}
                onCheckedChange={() => toggleColumnVisibility('createdAt')}
              >
                Created Date
              </DropdownMenuCheckboxItem>
              
              {/* Custom fields column toggles */}
              {customFields.length > 0 && <DropdownMenuSeparator />}
              {customFields.map(field => (
                <DropdownMenuCheckboxItem
                  key={field}
                  checked={columnVisibility[field]}
                  onCheckedChange={() => toggleColumnVisibility(field)}
                >
                  {field}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
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
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columnVisibility.name && <TableCell><Skeleton className="h-6 w-32" /></TableCell>}
                  {columnVisibility.email && <TableCell><Skeleton className="h-6 w-48" /></TableCell>}
                  {columnVisibility.phone && <TableCell><Skeleton className="h-6 w-24" /></TableCell>}
                  {visibleCustomFields.map((field, i) => (
                    <TableCell key={i}><Skeleton className="h-6 w-24" /></TableCell>
                  ))}
                  {columnVisibility.createdAt && <TableCell><Skeleton className="h-6 w-24" /></TableCell>}
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                </TableRow>
              ))
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
                <TableRow key={customer.id}>
                  {columnVisibility.name && <TableCell>{customer.name}</TableCell>}
                  {columnVisibility.email && <TableCell>{customer.email}</TableCell>}
                  {columnVisibility.phone && <TableCell>{customer.phone}</TableCell>}
                  {visibleCustomFields.map(field => (
                    <TableCell key={field}>
                      {customer.customFields?.[field] || "-"}
                    </TableCell>
                  ))}
                  {columnVisibility.createdAt && (
                    <TableCell>
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(customer.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              customer and all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomersTable;
