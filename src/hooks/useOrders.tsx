
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/domain/models/order";
import { orderService } from "@/services/orderService";

export const useOrders = () => {
  const {
    data: orders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderService.getOrders,
  });

  return {
    orders,
    isLoading,
    error,
    refetch,
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
