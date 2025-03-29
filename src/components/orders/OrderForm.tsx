
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderApiRequest } from "@/domain/models/order";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import FormActions from "./form/FormActions";
import { useEntityCustomFields } from "@/hooks/useEntityCustomFields";
import EntityCustomFieldsSection from "@/components/shared/EntityCustomFieldsSection";

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
  const { fields: orderFields, isLoading: isLoadingFields } = useEntityCustomFields("Order");

  // Initialize form with default values
  const form = useForm({
    defaultValues: {
      customFields: (order?.customFields || {}) as Record<string, string | number>
    }
  });

  // Initialize association fields with default values if creating a new order
  useEffect(() => {
    if (!isEditMode) {
      const associationFields = orderFields.filter(f => 
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
  }, [orderFields, isEditMode, form]);

  // Set form values from order if in edit mode
  useEffect(() => {
    if (isEditMode && order) {
      // Reset form with order values
      form.reset({
        customFields: (order.customFields || {}) as Record<string, string | number>
      });
    }
  }, [isEditMode, order, form]);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Create associations object from custom fields
      const associations: Record<string, string> = {};
      
      // Get association fields
      const associationFields = orderFields.filter(f => 
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
      
      const orderData: OrderApiRequest = {
        customFields: data.customFields as Record<string, string | number | boolean | Date>,
        associations: associations
      };

      console.log("Submitting order data:", orderData);

      if (isEditMode && order) {
        await updateOrder({ id: order.id, ...orderData });
        toast.success("Order updated successfully");
      } else {
        await createOrder(orderData);
        toast.success("Order created successfully");
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error(isEditMode ? "Failed to update order" : "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-5 py-4 max-h-[calc(80vh-180px)] overflow-y-auto pr-2">
          <EntityCustomFieldsSection 
            customFields={orderFields}
            form={form}
            entityType="Order"
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

export default OrderForm;
