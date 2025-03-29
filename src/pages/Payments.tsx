
import React, { useState } from "react";
import { usePayments } from "@/hooks/usePayments";
import PaymentsTable from "@/components/payments/PaymentsTable";
import PaymentDialog from "@/components/payments/PaymentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Filter, RefreshCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Payment } from "@/domain/models/payment";

const Payments: React.FC = () => {
  const { payments, isLoading, refetch } = usePayments();
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  // Calculate total amount from completed payments
  const totalCompletedAmount = payments
    .filter(payment => payment.status === 'completed')
    .reduce((total, payment) => total + payment.amount, 0);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const handleAddNewPayment = () => {
    setCurrentPayment(null);
    setIsEditMode(false);
    setOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setCurrentPayment(payment);
    setIsEditMode(true);
    setOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button onClick={handleAddNewPayment}>
          <CreditCard className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-card rounded-lg p-3 shadow-sm border border-border">
        <div className="flex-1">
          <Input placeholder="Search payments..." className="w-full" />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCompletedAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(payment => payment.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(payment => payment.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed/Refunded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(payment => ['failed', 'refunded'].includes(payment.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentsTable 
            payments={payments} 
            isLoading={isLoading} 
            onEdit={handleEditPayment}
          />
        </CardContent>
      </Card>

      <PaymentDialog
        open={open}
        onOpenChange={setOpen}
        isEditMode={isEditMode}
        payment={currentPayment}
      />
    </div>
  );
};

export default Payments;
