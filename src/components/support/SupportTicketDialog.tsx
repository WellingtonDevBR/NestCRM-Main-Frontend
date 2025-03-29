
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  ticket 
}) => {
  const handleSuccess = () => {
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Support Ticket" : "Create New Support Ticket"}</DialogTitle>
        </DialogHeader>
        <SupportTicketForm
          isEditMode={isEditMode}
          ticket={ticket}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupportTicketDialog;
