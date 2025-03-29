
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
import { Customer } from "@/domain/models/customer";
import { CustomField } from "@/domain/models/customField";
import DynamicFieldRenderer from '@/components/shared/DynamicFieldRenderer';

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
  // Filter out association fields that are not marked for use
  const visibleFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );
  
  console.log("CustomerTableRow - customer data:", customer);
  console.log("CustomerTableRow - customer.customFields:", customer.customFields);
  console.log("CustomerTableRow - visible columns:", visibleColumns);
  console.log("CustomerTableRow - custom fields:", customFields);
  
  return (
    <TableRow key={customer.id}>
      {/* Custom fields from settings */}
      {visibleFields.map(field => {
        const isVisible = visibleColumns[field.key];
        
        // Important: We use field.key to access the data from customer.customFields
        const fieldValue = customer.customFields ? customer.customFields[field.key] : null;
        
        console.log(`Row rendering - Field ${field.key} (display label: "${field.label}") visibility:`, isVisible);
        console.log(`Row rendering - Field ${field.key} value:`, fieldValue);
        
        return isVisible ? (
          <TableCell key={field.key}>
            <DynamicFieldRenderer 
              value={fieldValue} 
              uiConfig={field.uiConfig}
            />
          </TableCell>
        ) : null;
      })}
      
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
