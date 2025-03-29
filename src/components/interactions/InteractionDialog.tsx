
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Interaction } from "@/domain/models/interaction";
import InteractionForm from "./InteractionForm";

interface InteractionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  interaction: Interaction | null;
}

const InteractionDialog: React.FC<InteractionDialogProps> = ({ 
  open, 
  onOpenChange, 
  isEditMode,
  interaction 
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
          <DialogTitle>{isEditMode ? "Edit Interaction" : "Log New Interaction"}</DialogTitle>
        </DialogHeader>
        <InteractionForm
          isEditMode={isEditMode}
          interaction={interaction}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InteractionDialog;
