
import React from "react";
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

interface CustomerActionsProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerActions: React.FC<CustomerActionsProps> = ({
  customer,
  onEdit,
  onDelete
}) => {
  return (
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
  );
};

export default CustomerActions;
