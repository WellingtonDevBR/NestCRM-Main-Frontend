
import React from "react";
import { Order } from "@/domain/models/order";
import EntityActions, { ActionItem } from "@/components/shared/EntityActions";
import { Edit, Trash, Eye } from "lucide-react";

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
  const actions: ActionItem[] = [
    {
      icon: Eye,
      label: "View Details",
      onClick: () => onView && onView(order),
      condition: !!onView
    },
    {
      icon: Edit,
      label: "Edit",
      onClick: () => onEdit && onEdit(order),
      condition: !!onEdit
    },
    {
      icon: Trash,
      label: "Delete",
      onClick: () => onDelete && onDelete(order.id),
      className: "text-red-600 focus:text-red-600",
      condition: !!onDelete
    }
  ];

  return <EntityActions actions={actions} />;
};

export default OrderActions;
