
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface OrderInfoFieldsProps {
  form: UseFormReturn<any>;
}

const OrderInfoFields: React.FC<OrderInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="orderNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Order Number</FormLabel>
            <FormControl>
              <Input placeholder="Order Number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default OrderInfoFields;
