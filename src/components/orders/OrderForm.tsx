
import React, { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderApiRequest } from "@/domain/models/order";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import CustomerInfoFields from "./form/CustomerInfoFields";
import OrderStatusField from "./form/OrderStatusField";
import OrderDetailsFields from "./form/OrderDetailsFields";
import FormActions from "./form/FormActions";

interface OrderFormProps {
  isEditMode: boolean;
  order: Order | null;
  onCancel: () => void;
  onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isEditMode,
  order,
  onCancel,
  onSuccess,
}) => {
  const { createOrder, updateOrder } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      customerId: order?.customerId || "",
      customerName: order?.customerName || "",
      status: (order?.status as string) || "pending",
      total: order?.total || 0,
      items: order?.items || [{ id: "1", productName: "", quantity: 1, unitPrice: 0, total: 0 }],
      customFields: order?.customFields || {}
    }
  });

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const orderData: OrderApiRequest = {
        customFields: data.customFields,
        associations: {
          id: data.customerId,
          email: data.email
        },
        items: data.items,
        status: data.status as Order['status'],
        total: data.total
      };

      if (isEditMode && order) {
        await updateOrder({ id: order.id, ...orderData });
      } else {
        await createOrder(orderData);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <CustomerInfoFields form={form} />
          <OrderStatusField form={form} />
          <OrderDetailsFields form={form} />
          {/* Additional fields can be added here */}
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

export default OrderForm;
