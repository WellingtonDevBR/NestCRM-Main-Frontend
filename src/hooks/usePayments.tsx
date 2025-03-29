
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Payment, PaymentApiRequest } from "@/domain/models/payment";
import { paymentService } from "@/services/paymentService";

export const usePayments = () => {
  const queryClient = useQueryClient();
  
  const {
    data: payments = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: paymentService.getPayments,
  });

  const { mutateAsync: createPayment } = useMutation({
    mutationFn: (paymentData: PaymentApiRequest) => 
      paymentService.createPayment(paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    }
  });

  return {
    payments,
    isLoading,
    error,
    refetch,
    createPayment
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
