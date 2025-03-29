
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

interface OrderDetailsFieldsProps {
  form: UseFormReturn<any>;
}

const OrderDetailsFields: React.FC<OrderDetailsFieldsProps> = ({ form }) => {
  return (
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
  );
};

export default OrderDetailsFields;
