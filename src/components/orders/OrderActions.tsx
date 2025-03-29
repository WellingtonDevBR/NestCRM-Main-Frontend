
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
import { Edit, MoreHorizontal, Trash, Eye } from "lucide-react";
import { Order } from "@/domain/models/order";

interface OrderActionsProps {
  order: Order;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  onView,
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
        {onView && (
          <DropdownMenuItem onClick={() => onView(order)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(order)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(order.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
