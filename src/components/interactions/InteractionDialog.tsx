
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  interaction,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Interaction" : "Log New Interaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update interaction details"
              : "Log a new customer interaction in your database"}
          </DialogDescription>
        </DialogHeader>

        <InteractionForm
          isEditMode={isEditMode}
          interaction={interaction}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default InteractionDialog;
