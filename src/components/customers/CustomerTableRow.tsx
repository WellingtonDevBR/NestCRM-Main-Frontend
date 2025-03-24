
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Customer, CustomField } from "@/domain/models/customer";

interface CustomerTableRowProps {
  customer: Customer;
  visibleColumns: Record<string, boolean>;
  customFields: CustomField[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  customer,
  visibleColumns,
  customFields,
  onEdit,
  onDelete
}) => {
  // Function to format custom field values based on their type
  const formatCustomFieldValue = (field: CustomField, value: any) => {
    if (!value && value !== 0) return "-";
    
    if (field.type === "number") {
      return typeof value === "number" ? value.toLocaleString() : value;
    } else if (field.type === "date") {
      try {
        return new Date(value).toLocaleDateString();
      } catch (e) {
        return value;
      }
    }
    
    return value;
  };

  // Lookup custom field definitions by key
  const getCustomFieldByLabel = (label: string): CustomField | undefined => {
    return customFields.find(field => field.label === label);
  };

  return (
    <TableRow key={customer.id}>
      {visibleColumns.name && <TableCell>{customer.name}</TableCell>}
      {visibleColumns.email && <TableCell>{customer.email}</TableCell>}
      {visibleColumns.phone && <TableCell>{customer.phone}</TableCell>}
      
      {/* Custom fields from settings */}
      {customFields.map(field => 
        visibleColumns[field.key] && (
          <TableCell key={field.key}>
            {formatCustomFieldValue(
              field, 
              customer.customFields?.[field.label]
            )}
          </TableCell>
        )
      )}
      
      {visibleColumns.createdAt && (
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
              onClick={() => onDelete(customer.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
