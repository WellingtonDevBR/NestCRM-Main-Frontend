
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
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import DynamicFieldRenderer from "@/components/shared/DynamicFieldRenderer";
import SupportTicketActions from "./SupportTicketActions";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onView?: (ticket: SupportTicket) => void;
  onEdit?: (ticket: SupportTicket) => void;
  onReply?: (ticket: SupportTicket) => void;
  onEscalate?: (ticketId: string) => void;
  onResolve?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
}

const SupportTicketsTable: React.FC<SupportTicketsTableProps> = ({ 
  tickets, 
  isLoading,
  onView,
  onEdit,
  onReply,
  onEscalate,
  onResolve,
  onDelete
}) => {
  // Using the targeted query to only fetch Support specific fields
  const { data: supportFieldsData, isLoading: isLoadingSupportFields } = 
    useCustomFields().useCategoryFields("Support");
  
  // Get the support custom fields
  const supportCustomFields = supportFieldsData?.fields || [];
  
  // Filter out association fields that are not marked for use
  const visibleSupportFields = supportCustomFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation === true
  );

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (visibleSupportFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      visibleSupportFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [visibleSupportFields]);

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
          customFields={visibleSupportFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {visibleSupportFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="hover:bg-gray-50">
              {/* Render custom field values if present */}
              {visibleSupportFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    <DynamicFieldRenderer 
                      value={ticket.customFields?.[field.key]}
                      uiConfig={field.uiConfig}
                    />
                  </TableCell>
                )
              ))}
              <TableCell className="text-right">
                <SupportTicketActions 
                  ticket={ticket}
                  onView={onView}
                  onEdit={onEdit}
                  onReply={onReply}
                  onEscalate={onEscalate}
                  onResolve={onResolve}
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

export default SupportTicketsTable;
