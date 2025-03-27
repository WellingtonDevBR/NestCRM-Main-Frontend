
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
import { Skeleton } from "@/components/ui/skeleton";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import DynamicFieldRenderer from "@/components/shared/DynamicFieldRenderer";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
}

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

  // Function to get the custom field definition by key
  const getFieldByKey = (key: string) => {
    return orderCustomFields.find(field => field.key === key);
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
                    <DynamicFieldRenderer 
                      value={order.customFields?.[field.key]} 
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

export default OrdersTable;
