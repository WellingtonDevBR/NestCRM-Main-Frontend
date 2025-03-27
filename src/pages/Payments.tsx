
import React from "react";
import { usePayments } from "@/hooks/usePayments";
import PaymentsTable from "@/components/payments/PaymentsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Filter, RefreshCw, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Payments: React.FC = () => {
  const { payments, isLoading, refetch } = usePayments();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Payments</h1>
        <Button>
          <CreditCard className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>
      
      <div className="flex items-center gap-4 bg-card rounded-lg p-3 shadow-sm border border-border dark:bg-gray-800 dark:border-gray-700">
        <div className="flex-1">
          <Input placeholder="Search payments..." className="w-full dark:bg-gray-800 dark:border-gray-700" />
        </div>
        <Button variant="outline" size="sm" className="dark:border-gray-700 dark:hover:bg-gray-700">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="ghost" size="sm" onClick={() => refetch()} className="dark:hover:bg-gray-700">
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
          <PaymentsTable payments={payments} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
