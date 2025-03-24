
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/domain/models/customer";
import CustomerForm from "./CustomerForm";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  customer: Customer | null;
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  customer,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update customer information"
              : "Add a new customer to your database"}
          </DialogDescription>
        </DialogHeader>

        <CustomerForm
          isEditMode={isEditMode}
          customer={customer}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;
