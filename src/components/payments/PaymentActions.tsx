
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
import { Edit, MoreHorizontal, Trash, Eye, FileText, RotateCcw } from "lucide-react";
import { Payment } from "@/domain/models/payment";

interface PaymentActionsProps {
  payment: Payment;
  onView?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDownloadReceipt?: (paymentId: string) => void;
  onRefund?: (payment: Payment) => void;
  onDelete?: (paymentId: string) => void;
}

const PaymentActions: React.FC<PaymentActionsProps> = ({
  payment,
  onView,
  onEdit,
  onDownloadReceipt,
  onRefund,
  onDelete
}) => {
  const isRefundable = payment.status === 'completed';

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
          <DropdownMenuItem onClick={() => onView(payment)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(payment)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onDownloadReceipt && (
          <DropdownMenuItem onClick={() => onDownloadReceipt(payment.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Download Receipt
          </DropdownMenuItem>
        )}
        {onRefund && isRefundable && (
          <DropdownMenuItem onClick={() => onRefund(payment)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Process Refund
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(payment.id)}
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

export default PaymentActions;
