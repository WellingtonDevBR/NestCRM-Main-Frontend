
import React, { useState, useEffect } from "react";
import { SupportTicket } from "@/domain/models/support";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
}

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({ tickets, isLoading }) => {
  // Using the targeted query to only fetch Support specific fields
  const { data: supportFieldsData, isLoading: isLoadingSupportFields } = 
    useCustomFields().useCategoryFields("Support");
  
  // Get the support custom fields
  const supportCustomFields = supportFieldsData?.fields || [];

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (supportCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      supportCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [supportCustomFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading || isLoadingSupportFields) {
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={supportCustomFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {supportCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer hover:bg-gray-50">
              {/* Render custom field values if present */}
              {supportCustomFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    {ticket.customFields && field.key in ticket.customFields
                      ? (typeof ticket.customFields[field.key] === 'object' && ticket.customFields[field.key] instanceof Date)
                        ? format(new Date(ticket.customFields[field.key] as Date), 'dd MMM yyyy')
                        : String(ticket.customFields[field.key])
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

export default SupportTicketsTable;
