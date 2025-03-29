
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Order } from "@/domain/models/order";
import OrderForm from "./OrderForm";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  order: Order | null;
}

const OrderDialog: React.FC<OrderDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  order,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Order" : "Add New Order"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update order information"
              : "Add a new order to your database"}
          </DialogDescription>
        </DialogHeader>

        <OrderForm
          isEditMode={isEditMode}
          order={order}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
