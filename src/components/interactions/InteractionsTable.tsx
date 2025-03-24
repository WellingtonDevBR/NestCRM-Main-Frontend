
import React from "react";
import { Interaction } from "@/domain/models/interaction";
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

interface InteractionsTableProps {
  interactions: Interaction[];
  isLoading: boolean;
}

const getTypeIcon = (type: Interaction['type']) => {
  switch (type) {
    case 'email':
      return "📧";
    case 'call':
      return "📞";
    case 'meeting':
      return "👥";
    case 'chat':
      return "💬";
    default:
      return "🔄";
  }
};

const getStatusColor = (status: Interaction['status']) => {
  switch (status) {
    case 'open':
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case 'closed':
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case 'pending':
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const InteractionsTable: React.FC<InteractionsTableProps> = ({ interactions, isLoading }) => {
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

  if (interactions.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <p className="text-muted-foreground">No interactions found</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Subject</TableHead>
          <TableHead>Agent</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {interactions.map((interaction) => (
          <TableRow key={interaction.id} className="cursor-pointer hover:bg-gray-50">
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{getTypeIcon(interaction.type)}</span>
                <span className="capitalize">{interaction.type}</span>
              </div>
            </TableCell>
            <TableCell>{interaction.customerName}</TableCell>
            <TableCell>{format(new Date(interaction.date), 'dd MMM yyyy')}</TableCell>
            <TableCell className="font-medium">{interaction.subject}</TableCell>
            <TableCell>{interaction.agentName}</TableCell>
            <TableCell>
              {interaction.type === 'email' 
                ? '—' 
                : `${interaction.duration} min${interaction.duration !== 1 ? 's' : ''}`}
            </TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(interaction.status)}>
                {interaction.status.charAt(0).toUpperCase() + interaction.status.slice(1)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InteractionsTable;
