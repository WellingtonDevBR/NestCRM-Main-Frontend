
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSupportTickets } from "@/hooks/useSupportTickets";
import { SupportTicket, SupportTicketApiRequest } from "@/domain/models/support";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormActions from "../shared/FormActions";
import { useEntityCustomFields } from "@/hooks/useEntityCustomFields";
import EntityCustomFieldsSection from "@/components/shared/EntityCustomFieldsSection";

interface SupportTicketFormProps {
  isEditMode: boolean;
  ticket: SupportTicket | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const SupportTicketForm: React.FC<SupportTicketFormProps> = ({
  isEditMode,
  ticket,
  onCancel,
  onSuccess,
}) => {
  const { createSupportTicket, updateSupportTicket } = useSupportTickets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fields: supportFields, isLoading: isLoadingFields } = useEntityCustomFields("Support");

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      subject: ticket?.subject || "",
      description: ticket?.description || "",
      status: (ticket?.status as string) || "open",
      priority: (ticket?.priority as string) || "medium",
      assignedTo: ticket?.assignedTo || "",
      customFields: ticket?.customFields || {} as Record<string, string | number>
    }
  });

  // Initialize association fields with default values if creating a new ticket
  useEffect(() => {
    if (!isEditMode) {
      const associationFields = supportFields.filter(f => 
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
  }, [supportFields, isEditMode, form]);

  // Set form values from ticket if in edit mode
  useEffect(() => {
    if (isEditMode && ticket) {
      // Reset form with ticket values
      form.reset({
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        assignedTo: ticket.assignedTo || "",
        customFields: ticket.customFields as Record<string, string | number> || {}
      });
    }
  }, [isEditMode, ticket, form]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create associations object from custom fields
      const associations: Record<string, string> = {};
      
      // Get association fields
      const associationFields = supportFields.filter(f => 
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
      
      const ticketData: SupportTicketApiRequest = {
        customFields: data.customFields as Record<string, string | number | boolean | Date>,
        associations: associations,
        subject: data.subject,
        description: data.description,
        status: data.status as SupportTicket['status'],
        priority: data.priority as SupportTicket['priority'],
        assignedTo: data.assignedTo
      };

      console.log("Submitting support ticket data:", ticketData);

      if (isEditMode && ticket) {
        await updateSupportTicket({ id: ticket.id, ...ticketData });
        toast.success("Support ticket updated successfully");
      } else {
        await createSupportTicket(ticketData);
        toast.success("Support ticket created successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      toast.error(isEditMode ? "Failed to update support ticket" : "Failed to create support ticket");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <EntityCustomFieldsSection 
            customFields={supportFields}
            form={form}
            entityType="Support"
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

export default SupportTicketForm;
