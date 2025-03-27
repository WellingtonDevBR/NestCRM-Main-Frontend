
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
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import DynamicFieldRenderer from "@/components/shared/DynamicFieldRenderer";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ payments, isLoading }) => {
  // Using the targeted query to only fetch Payment specific fields
  const { data: paymentFieldsData, isLoading: isLoadingPaymentFields } = 
    useCustomFields().useCategoryFields("Payment");
  
  // Get the payment custom fields
  const paymentCustomFields = paymentFieldsData?.fields || [];

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (paymentCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      paymentCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
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
          customFields={paymentCustomFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {paymentCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="cursor-pointer hover:bg-gray-50">
              {/* Render custom field values if present */}
              {paymentCustomFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    <DynamicFieldRenderer 
                      value={payment.customFields?.[field.key]}
                      uiConfig={field.uiConfig}
                    />
                  </TableCell>
                )
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
