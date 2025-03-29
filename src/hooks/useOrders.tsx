
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Order, OrderApiRequest } from "@/domain/models/order";
import { orderService } from "@/services/orderService";

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

  const { mutateAsync: createOrder } = useMutation({
    mutationFn: (orderData: OrderApiRequest) => 
      orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    }
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
    createOrder
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
