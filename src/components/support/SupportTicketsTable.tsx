
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { SupportTicket } from "@/domain/models/support";
import { formatDate } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onEdit: (ticket: SupportTicket) => void;
}

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({
  tickets,
  isLoading,
  onEdit
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No support tickets found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>{ticket.ticketNumber}</TableCell>
              <TableCell>{ticket.customerName}</TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.status.replace('_', ' ')}</TableCell>
              <TableCell>{ticket.priority}</TableCell>
              <TableCell>{formatDate(ticket.dateCreated)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(ticket)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupportTicketsTable;
