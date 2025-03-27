
import React, { useState, useEffect } from "react";
import { Order } from "@/domain/models/order";
import { useCustomFields } from "@/hooks/useCustomFields";
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
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case 'processing':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'shipped':
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case 'delivered':
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case 'cancelled':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading }) => {
  // Using the targeted query to only fetch Order specific fields
  const { data: orderFieldsData, isLoading: isLoadingOrderFields } = 
    useCustomFields().useCategoryFields("Order");
  
  // Get the order custom fields
  const orderCustomFields = orderFieldsData?.fields || [];

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (orderCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      orderCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [orderCustomFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading || isLoadingOrderFields) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">No orders found</p>
      </div>
    );
  }

  // Get all visible columns
  const visibleColumns = Object.entries(columnVisibility)
    .filter(([_, isVisible]) => isVisible)
    .map(([column]) => column);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={orderCustomFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {orderCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
              {/* Render custom field values if present */}
              {orderCustomFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    {order.customFields && field.key in order.customFields
                      ? (typeof order.customFields[field.key] === 'object' && order.customFields[field.key] instanceof Date)
                        ? format(new Date(order.customFields[field.key] as Date), 'dd MMM yyyy')
                        : String(order.customFields[field.key])
                      : '—'}
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

export default OrdersTable;
