
import React from "react";
import { Payment } from "@/domain/models/payment";
import EntityActions, { ActionItem } from "@/components/shared/EntityActions";
import { Edit, Trash, Eye, FileText, RotateCcw } from "lucide-react";

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

  const actions: ActionItem[] = [
    {
      icon: Eye,
      label: "View Details",
      onClick: () => onView && onView(payment),
      condition: !!onView
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: () => onEdit && onEdit(payment),
      condition: !!onEdit
    },
    {
      icon: FileText,
      label: "Download Receipt",
      onClick: () => onDownloadReceipt && onDownloadReceipt(payment.id),
      condition: !!onDownloadReceipt
    },
    {
      icon: RotateCcw,
      label: "Process Refund",
      onClick: () => onRefund && onRefund(payment),
      condition: !!onRefund && isRefundable
    },
    {
      icon: Trash,
      label: "Delete",
      onClick: () => onDelete && onDelete(payment.id),
      className: "text-red-600 focus:text-red-600",
      condition: !!onDelete
    }
  ];

  return <EntityActions actions={actions} />;
};

export default PaymentActions;
