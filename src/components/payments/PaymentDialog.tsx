
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Payment } from "@/domain/models/payment";
import PaymentForm from "./PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  payment: Payment | null;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  payment,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Payment" : "Record New Payment"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update payment information"
              : "Record a new payment in your database"}
          </DialogDescription>
        </DialogHeader>

        <PaymentForm
          isEditMode={isEditMode}
          payment={payment}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
