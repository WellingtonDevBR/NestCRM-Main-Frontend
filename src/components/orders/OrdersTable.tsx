
import React from "react";
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
  // Using the new targeted query to only fetch Order specific fields
  const { data: orderFieldsData, isLoading: isLoadingOrderFields } = 
    useCustomFields().useCategoryFields("Order");
  
  // Get the order custom fields
  const orderCustomFields = orderFieldsData?.fields || [];

  // We could add column visibility state here similar to CustomerTable
  // const [columnVisibility, setColumnVisibility] = useState({ /* default visibility */ });

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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Items</TableHead>
          
          {/* Render custom field headers dynamically */}
          {orderCustomFields.map(field => (
            <TableHead key={field.key}>{field.label}</TableHead>
          ))}
          
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="cursor-pointer hover:bg-gray-50">
            <TableCell className="font-medium">{order.orderNumber}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>{format(new Date(order.date), 'dd MMM yyyy')}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(order.status)}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{order.items.length}</TableCell>
            
            {/* Render custom field values if present */}
            {orderCustomFields.map(field => (
              <TableCell key={field.key}>
                {order.customFields?.[field.key] || '—'}
              </TableCell>
            ))}
            
            <TableCell className="text-right font-medium">
              {formatCurrency(order.total)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
