
import React from "react";
import { SupportTicket } from "@/domain/models/support";
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

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
}

const getStatusColor = (status: SupportTicket['status']) => {
  switch (status) {
    case 'open':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'in_progress':
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case 'resolved':
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case 'closed':
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getPriorityColor = (priority: SupportTicket['priority']) => {
  switch (priority) {
    case 'low':
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case 'medium':
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case 'high':
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case 'critical':
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const formatStatus = (status: string) => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({ tickets, isLoading }) => {
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

  if (tickets.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">No support tickets found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ticket #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="cursor-pointer hover:bg-gray-50">
            <TableCell className="font-medium">{ticket.ticketNumber}</TableCell>
            <TableCell>{ticket.customerName}</TableCell>
            <TableCell>{ticket.subject}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                {formatStatus(ticket.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{ticket.assignedTo}</TableCell>
            <TableCell>{format(new Date(ticket.createdAt), 'dd MMM yyyy')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SupportTicketsTable;
