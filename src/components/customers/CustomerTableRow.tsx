
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
  // Function to get the custom field definition by key
  const getFieldByKey = (key: string): CustomField | undefined => {
    return customFields.find(field => field.key === key);
  };

  // Filter out association fields that are not marked for use
  const visibleFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );

  return (
    <TableRow key={customer.id}>
      {/* Custom fields from settings */}
      {visibleFields.map(field => 
        visibleColumns[field.key] && (
          <TableCell key={field.key}>
            <DynamicFieldRenderer 
              value={customer.customFields?.[field.key]} 
              uiConfig={field.uiConfig}
            />
          </TableCell>
        )
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
