
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderApiRequest } from "@/domain/models/order";
import { orderService } from "@/services/orderService";
import { toast } from "sonner";

export const useOrders = () => {
  const queryClient = useQueryClient();
  
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getOrders,
  });

  const { mutateAsync: createOrder, isPending: isCreating } = useMutation({
    mutationFn: (orderData: OrderApiRequest) => 
      orderService.createOrder(orderData),
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    }
  });

  const { mutateAsync: updateOrder, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & OrderApiRequest) => 
      orderService.updateOrder(id, data),
    onSuccess: () => {
      toast.success("Order updated successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    }
  });

  const { mutateAsync: deleteOrder, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => 
      orderService.deleteOrder(id),
    onSuccess: () => {
      toast.success("Order deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    createOrder,
    updateOrder,
    deleteOrder,
    isCreating,
    isUpdating,
    isDeleting
  };
};

export const useOrderById = (id: string) => {
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });

  return {
    order,
    isLoading,
    error,
  };
};

export const useOrdersByCustomerId = (customerId: string) => {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", "customer", customerId],
    queryFn: () => orderService.getOrdersByCustomerId(customerId),
    enabled: !!customerId,
  });

  return {
    orders,
    isLoading,
    error,
  };
};
