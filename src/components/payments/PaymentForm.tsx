
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { usePayments } from "@/hooks/usePayments";
import { Payment, PaymentApiRequest } from "@/domain/models/payment";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormActions from "./form/FormActions";
import { useEntityCustomFields } from "@/hooks/useEntityCustomFields";
import EntityCustomFieldsSection from "@/components/shared/EntityCustomFieldsSection";

interface PaymentFormProps {
  isEditMode: boolean;
  payment: Payment | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  isEditMode,
  payment,
  onCancel,
  onSuccess,
}) => {
  const { createPayment, updatePayment } = usePayments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { fields: paymentFields, isLoading: isLoadingFields } = useEntityCustomFields("Payment");

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      customFields: (payment?.customFields || {}) as Record<string, string | number>
    }
  });

  // Initialize association fields with default values if creating a new payment
  useEffect(() => {
    if (!isEditMode) {
      const associationFields = paymentFields.filter(f => 
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
  }, [paymentFields, isEditMode, form]);

  // Set form values from payment if in edit mode
  useEffect(() => {
    if (isEditMode && payment) {
      // Reset form with payment values
      form.reset({
        customFields: (payment.customFields || {}) as Record<string, string | number>
      });
    }
  }, [isEditMode, payment, form]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create associations object from custom fields
      const associations: Record<string, string> = {};
      
      // Get association fields
      const associationFields = paymentFields.filter(f => 
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
      
      // Add order_id if it exists in custom fields
      if (data.customFields.order_id) {
        associations.order_id = String(data.customFields.order_id);
      }
      
      const paymentData: PaymentApiRequest = {
        customFields: data.customFields as Record<string, string | number | boolean | Date>,
        associations: associations
      };

      console.log("Submitting payment data:", paymentData);

      if (isEditMode && payment) {
        await updatePayment({ id: payment.id, ...paymentData });
        toast.success("Payment updated successfully");
      } else {
        await createPayment(paymentData);
        toast.success("Payment created successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error(isEditMode ? "Failed to update payment" : "Failed to create payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <EntityCustomFieldsSection 
            customFields={paymentFields}
            form={form}
            entityType="Payment"
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

export default PaymentForm;
