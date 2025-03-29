
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useOrders } from "@/hooks/useOrders";
import { Order, OrderApiRequest, OrderItem } from "@/domain/models/order";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer ID</FormLabel>
                <FormControl>
                  <Input placeholder="Customer ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Order total" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional fields can be added here */}
        </div>

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
            {isSubmitting ? "Saving..." : isEditMode ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OrderForm;
