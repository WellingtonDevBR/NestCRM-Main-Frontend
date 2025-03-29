
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useInteractions } from "@/hooks/useInteractions";
import { Interaction, InteractionApiRequest } from "@/domain/models/interaction";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormActions from "../shared/FormActions";
import { useEntityCustomFields } from "@/hooks/useEntityCustomFields";
import EntityCustomFieldsSection from "@/components/shared/EntityCustomFieldsSection";

interface InteractionFormProps {
  isEditMode: boolean;
  interaction: Interaction | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const InteractionForm: React.FC<InteractionFormProps> = ({
  isEditMode,
  interaction,
  onCancel,
  onSuccess,
}) => {
  const { createInteraction, updateInteraction } = useInteractions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fields: interactionFields, isLoading: isLoadingFields } = useEntityCustomFields("Interaction");

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      customFields: (interaction?.customFields || {}) as Record<string, string | number>
    }
  });

  // Initialize association fields with default values if creating a new interaction
  useEffect(() => {
    if (!isEditMode) {
      const associationFields = interactionFields.filter(f => 
        f.isAssociationField === true && 
        f.useAsAssociation === true
      );
      
      const initialCustomFields: Record<string, string | number> = { ...form.getValues("customFields") };
      
      associationFields.forEach(field => {
        if (!initialCustomFields[field.key]) {
          if (field.type === 'number') {
            initialCustomFields[field.key] = 0;
          } else {
            initialCustomFields[field.key] = "";
          }
        }
      });
      
      form.setValue("customFields", initialCustomFields);
    }
  }, [interactionFields, isEditMode, form]);

  // Set form values from interaction if in edit mode
  useEffect(() => {
    if (isEditMode && interaction) {
      // Reset form with interaction values
      form.reset({
        customFields: (interaction.customFields || {}) as Record<string, string | number>
      });
    }
  }, [isEditMode, interaction, form]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create associations object from custom fields
      const associations: Record<string, string> = {};
      
      // Get association fields
      const associationFields = interactionFields.filter(f => 
        f.isAssociationField === true && 
        f.useAsAssociation === true
      );
      
      associationFields.forEach(field => {
        if (data.customFields[field.key]) {
          if (field.key === 'id') {
            associations.id = String(data.customFields[field.key]);
          } else if (field.key === 'email') {
            associations.email = String(data.customFields[field.key]);
          }
        }
      });
      
      const interactionData: InteractionApiRequest = {
        customFields: data.customFields as Record<string, string | number | boolean | Date>,
        associations: associations
      };

      console.log("Submitting interaction data:", interactionData);

      if (isEditMode && interaction) {
        await updateInteraction({ id: interaction.id, ...interactionData });
        toast.success("Interaction updated successfully");
      } else {
        await createInteraction(interactionData);
        toast.success("Interaction created successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting interaction:", error);
      toast.error(isEditMode ? "Failed to update interaction" : "Failed to create interaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <EntityCustomFieldsSection 
            customFields={interactionFields}
            form={form}
            entityType="Interaction"
          />
        </div>

        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          isEditMode={isEditMode} 
        />
      </form>
    </Form>
  );
};

export default InteractionForm;
