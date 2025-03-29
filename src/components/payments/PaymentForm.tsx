
import React, { useState } from "react";
import { toast } from "sonner";
import { usePayments } from "@/hooks/usePayments";
import { Payment, PaymentApiRequest } from "@/domain/models/payment";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Import form section components
import CustomerInfoFields from "./form/CustomerInfoFields";
import OrderInfoFields from "./form/OrderInfoFields";
import PaymentMethodFields from "./form/PaymentMethodFields";
import PaymentDetailsFields from "./form/PaymentDetailsFields";
import FormActions from "./form/FormActions";

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

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      customerId: payment?.customerId || "",
      customerName: payment?.customerName || "",
      orderId: payment?.orderId || "",
      orderNumber: payment?.orderNumber || "",
      method: (payment?.method as string) || "credit_card",
      status: (payment?.status as string) || "pending",
      amount: payment?.amount || 0,
      reference: payment?.reference || "",
      customFields: payment?.customFields || {}
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const paymentData: PaymentApiRequest = {
        customFields: data.customFields,
        associations: {
          id: data.customerId,
          email: data.email,
          order_id: data.orderId
        },
        method: data.method as Payment['method'],
        status: data.status as Payment['status'],
        amount: data.amount,
        reference: data.reference
      };

      if (isEditMode && payment) {
        await updatePayment({ id: payment.id, ...paymentData });
      } else {
        await createPayment(paymentData);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <CustomerInfoFields form={form} />
          <OrderInfoFields form={form} />
          <PaymentMethodFields form={form} />
          <PaymentDetailsFields form={form} />
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
