
import { useQuery } from "@tanstack/react-query";
import { Payment } from "@/domain/models/payment";
import { paymentService } from "@/services/paymentService";

export const usePayments = () => {
  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentService.getPayments,
  });

  return {
    payments,
    isLoading,
    error,
    refetch,
  };
};

export const usePaymentById = (id: string) => {
  const {
    data: payment,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payment", id],
    queryFn: () => paymentService.getPaymentById(id),
    enabled: !!id,
  });

  return {
    payment,
    isLoading,
    error,
  };
};

export const usePaymentsByCustomerId = (customerId: string) => {
  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payments", "customer", customerId],
    queryFn: () => paymentService.getPaymentsByCustomerId(customerId),
    enabled: !!customerId,
  });

  return {
    payments,
    isLoading,
    error,
  };
};
