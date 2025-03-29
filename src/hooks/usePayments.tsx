
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Payment, PaymentApiRequest } from "@/domain/models/payment";
import { paymentService } from "@/services/paymentService";
import { toast } from "sonner";

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

  const { mutateAsync: createPayment, isPending: isCreating } = useMutation({
    mutationFn: (paymentData: PaymentApiRequest) => 
      paymentService.createPayment(paymentData),
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      console.error("Error recording payment:", error);
      toast.error("Failed to record payment");
    }
  });

  const { mutateAsync: updatePayment, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & PaymentApiRequest) => 
      paymentService.updatePayment(id, data),
    onSuccess: () => {
      toast.success("Payment updated successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      console.error("Error updating payment:", error);
      toast.error("Failed to update payment");
    }
  });

  const { mutateAsync: deletePayment, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => 
      paymentService.deletePayment(id),
    onSuccess: () => {
      toast.success("Payment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error) => {
      console.error("Error deleting payment:", error);
      toast.error("Failed to delete payment");
    }
  });

  return {
    payments,
    isLoading,
    error,
    refetch,
    createPayment,
    updatePayment,
    deletePayment,
    isCreating,
    isUpdating,
    isDeleting
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
