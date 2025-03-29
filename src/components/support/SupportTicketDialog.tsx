
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SupportTicket } from "@/domain/models/support";
import SupportTicketForm from "./SupportTicketForm";

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  ticket: SupportTicket | null;
}

const SupportTicketDialog: React.FC<SupportTicketDialogProps> = ({
  open,
  onOpenChange,
  isEditMode,
  ticket,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Support Ticket" : "Create New Ticket"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update support ticket details"
              : "Create a new support ticket in your database"}
          </DialogDescription>
        </DialogHeader>

        <SupportTicketForm
          isEditMode={isEditMode}
          ticket={ticket}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDialog;
