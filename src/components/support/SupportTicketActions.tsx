
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash, Eye, MessageCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { SupportTicket } from "@/domain/models/support";

interface SupportTicketActionsProps {
  ticket: SupportTicket;
  onView?: (ticket: SupportTicket) => void;
  onEdit?: (ticket: SupportTicket) => void;
  onReply?: (ticket: SupportTicket) => void;
  onEscalate?: (ticketId: string) => void;
  onResolve?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
}

const SupportTicketActions: React.FC<SupportTicketActionsProps> = ({
  ticket,
  onView,
  onEdit,
  onReply,
  onEscalate,
  onResolve,
  onDelete
}) => {
  const isOpen = ticket.status === 'open' || ticket.status === 'in_progress';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {onView && (
          <DropdownMenuItem onClick={() => onView(ticket)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(ticket)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {onReply && (
          <DropdownMenuItem onClick={() => onReply(ticket)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            Reply
          </DropdownMenuItem>
        )}
        {onEscalate && isOpen && (
          <DropdownMenuItem onClick={() => onEscalate(ticket.id)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Escalate
          </DropdownMenuItem>
        )}
        {onResolve && isOpen && (
          <DropdownMenuItem onClick={() => onResolve(ticket.id)}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Resolve Ticket
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem 
            onClick={() => onDelete(ticket.id)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SupportTicketActions;
