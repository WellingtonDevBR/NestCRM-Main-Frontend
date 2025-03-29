
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
import PaymentActions from "./PaymentActions";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading: boolean;
  onView?: (payment: Payment) => void;
  onEdit?: (payment: Payment) => void;
  onDownloadReceipt?: (paymentId: string) => void;
  onRefund?: (payment: Payment) => void;
  onDelete?: (paymentId: string) => void;
}

const PaymentsTable: React.FC<PaymentsTableProps> = ({ 
  payments, 
  isLoading,
  onView,
  onEdit,
  onDownloadReceipt,
  onRefund,
  onDelete
}) => {
  // Using the targeted query to only fetch Payment specific fields
  const { data: paymentFieldsData, isLoading: isLoadingPaymentFields } = 
    useCustomFields().useCategoryFields("Payment");
  
  // Get the payment custom fields
  const paymentCustomFields = paymentFieldsData?.fields || [];
  
  // Filter out association fields that are not marked for use
  const visiblePaymentFields = paymentCustomFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (visiblePaymentFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      visiblePaymentFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [visiblePaymentFields]);

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
          customFields={visiblePaymentFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {visiblePaymentFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id} className="hover:bg-gray-50">
              {/* Render custom field values if present */}
              {visiblePaymentFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    <DynamicFieldRenderer 
                      value={payment.customFields?.[field.key]}
                      uiConfig={field.uiConfig}
                    />
                  </TableCell>
                )
              ))}
              <TableCell className="text-right">
                <PaymentActions 
                  payment={payment}
                  onView={onView}
                  onEdit={onEdit}
                  onDownloadReceipt={onDownloadReceipt}
                  onRefund={onRefund}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTable;
