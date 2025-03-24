
import React from "react";
import { Payment } from "@/domain/models/payment";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

const getStatusColor = (status: Payment['status']) => {
  switch (status) {
    case 'pending':
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case 'completed':
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case 'failed':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case 'refunded':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getMethodDisplay = (method: Payment['method']) => {
  switch (method) {
    case 'credit_card':
      return "Credit Card";
    case 'bank_transfer':
      return "Bank Transfer";
    case 'paypal':
      return "PayPal";
    case 'cash':
      return "Cash";
    default:
      return method;
  }
};

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">No payments found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Reference</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Order #</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id} className="cursor-pointer hover:bg-gray-50">
            <TableCell className="font-medium">{payment.reference}</TableCell>
            <TableCell>{payment.customerName}</TableCell>
            <TableCell>{payment.orderNumber}</TableCell>
            <TableCell>{format(new Date(payment.date), 'dd MMM yyyy')}</TableCell>
            <TableCell>{getMethodDisplay(payment.method)}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(payment.status)}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(payment.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PaymentsTable;
