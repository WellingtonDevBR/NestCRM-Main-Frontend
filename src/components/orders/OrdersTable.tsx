
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
import DynamicFieldRenderer from '@/components/shared/DynamicFieldRenderer';
import OrderActions from "./OrderActions";

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onView?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  isLoading,
  onView,
  onEdit,
  onDelete
}) => {
  // Using the targeted query to only fetch Order specific fields
  const { data: orderFieldsData, isLoading: isLoadingOrderFields } = 
    useCustomFields().useCategoryFields("Order");
  
  // Get the order custom fields
  const orderCustomFields = orderFieldsData?.fields || [];
  
  // Filter out association fields that are not marked for use
  const visibleOrderFields = orderCustomFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (visibleOrderFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      visibleOrderFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [visibleOrderFields]);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={visibleOrderFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {visibleOrderFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50">
              {/* Render custom field values if present */}
              {visibleOrderFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    <DynamicFieldRenderer 
                      value={order.customFields?.[field.key]} 
                      uiConfig={field.uiConfig}
                    />
                  </TableCell>
                )
              ))}
              <TableCell className="text-right">
                <OrderActions 
                  order={order}
                  onView={onView}
                  onEdit={onEdit}
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

export default OrdersTable;
