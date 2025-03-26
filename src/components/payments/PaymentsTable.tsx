
import React, { useState, useEffect } from "react";
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
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

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
  // Using the targeted query to only fetch Payment specific fields
  const { data: paymentFieldsData, isLoading: isLoadingPaymentFields } = 
    useCustomFields().useCategoryFields("Payment");
  
  // Get the payment custom fields
  const paymentCustomFields = paymentFieldsData?.fields || [];

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    reference: true,
    customerName: true,
    orderNumber: true,
    date: true,
    method: true,
    status: true,
    amount: true
  });

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (paymentCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      paymentCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(prev => ({
        ...prev,
        ...customFieldVisibility
      }));
    }
  }, [paymentCustomFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading || isLoadingPaymentFields) {
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={paymentCustomFields || []}
          onToggleColumn={toggleColumnVisibility}
          basicColumns={[
            { key: 'reference', label: 'Reference' },
            { key: 'customerName', label: 'Customer' },
            { key: 'orderNumber', label: 'Order #' },
            { key: 'date', label: 'Date' },
            { key: 'method', label: 'Method' },
            { key: 'status', label: 'Status' },
            { key: 'amount', label: 'Amount' }
          ]}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.reference && <TableHead>Reference</TableHead>}
            {columnVisibility.customerName && <TableHead>Customer</TableHead>}
            {columnVisibility.orderNumber && <TableHead>Order #</TableHead>}
            {columnVisibility.date && <TableHead>Date</TableHead>}
            {columnVisibility.method && <TableHead>Method</TableHead>}
            {columnVisibility.status && <TableHead>Status</TableHead>}
            
            {/* Render custom field headers dynamically */}
            {paymentCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            
            {columnVisibility.amount && <TableHead className="text-right">Amount</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="cursor-pointer hover:bg-gray-50">
              {columnVisibility.reference && <TableCell className="font-medium">{payment.reference}</TableCell>}
              {columnVisibility.customerName && <TableCell>{payment.customerName}</TableCell>}
              {columnVisibility.orderNumber && <TableCell>{payment.orderNumber}</TableCell>}
              {columnVisibility.date && <TableCell>{format(new Date(payment.date), 'dd MMM yyyy')}</TableCell>}
              {columnVisibility.method && <TableCell>{getMethodDisplay(payment.method)}</TableCell>}
              {columnVisibility.status && (
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </TableCell>
              )}
              
              {/* Render custom field values if present */}
              {paymentCustomFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    {payment.customFields && field.key in payment.customFields
                      ? (typeof payment.customFields[field.key] === 'object' && payment.customFields[field.key] instanceof Date)
                        ? format(new Date(payment.customFields[field.key] as Date), 'dd MMM yyyy')
                        : String(payment.customFields[field.key])
                      : '—'}
                  </TableCell>
                )
              ))}
              
              {columnVisibility.amount && (
                <TableCell className="text-right font-medium">
                  {formatCurrency(payment.amount)}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
