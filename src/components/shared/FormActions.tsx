
import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSubmitting,
  isEditMode
}) => {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            {isEditMode ? "Updating..." : "Creating..."}
          </>
        ) : (
          <>
            {isEditMode ? "Update" : "Create"}
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActions;
