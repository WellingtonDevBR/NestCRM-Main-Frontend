
import React, { useState, useEffect } from "react";
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
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

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
    case 'note':
      return "📝";
    default:
      return "💬";
  }
};

const InteractionsTable: React.FC<InteractionsTableProps> = ({ interactions, isLoading }) => {
  // Using the targeted query to only fetch Interaction specific fields
  const { data: interactionFieldsData, isLoading: isLoadingInteractionFields } = 
    useCustomFields().useCategoryFields("Interaction");
  
  // Get the interaction custom fields
  const interactionCustomFields = interactionFieldsData?.fields || [];

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    date: true,
    customerName: true,
    type: true,
    subject: true,
    status: true
  });

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (interactionCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      interactionCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(prev => ({
        ...prev,
        ...customFieldVisibility
      }));
    }
  }, [interactionCustomFields]);

  const toggleColumnVisibility = (column: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  if (isLoading || isLoadingInteractionFields) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
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
    <div className="space-y-4">
      <div className="flex justify-end">
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={interactionCustomFields || []}
          onToggleColumn={toggleColumnVisibility}
          basicColumns={[
            { key: 'date', label: 'Date' },
            { key: 'customerName', label: 'Customer' },
            { key: 'type', label: 'Type' },
            { key: 'subject', label: 'Subject' },
            { key: 'status', label: 'Status' }
          ]}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columnVisibility.date && <TableHead>Date</TableHead>}
            {columnVisibility.customerName && <TableHead>Customer</TableHead>}
            {columnVisibility.type && <TableHead>Type</TableHead>}
            {columnVisibility.subject && <TableHead>Subject</TableHead>}
            
            {/* Render custom field headers dynamically */}
            {interactionCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            
            {columnVisibility.status && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {interactions.map((interaction) => (
            <TableRow key={interaction.id} className="cursor-pointer hover:bg-gray-50">
              {columnVisibility.date && <TableCell>{format(new Date(interaction.date), 'dd MMM yyyy HH:mm')}</TableCell>}
              {columnVisibility.customerName && <TableCell>{interaction.customerName}</TableCell>}
              {columnVisibility.type && (
                <TableCell>
                  <span className="mr-2">{getTypeIcon(interaction.type)}</span>
                  {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}
                </TableCell>
              )}
              {columnVisibility.subject && <TableCell className="font-medium">{interaction.subject}</TableCell>}
              
              {/* Render custom field values if present */}
              {interactionCustomFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    {interaction.customFields && field.key in interaction.customFields
                      ? (typeof interaction.customFields[field.key] === 'object' && interaction.customFields[field.key] instanceof Date)
                        ? format(new Date(interaction.customFields[field.key] as Date), 'dd MMM yyyy')
                        : String(interaction.customFields[field.key])
                      : '—'}
                  </TableCell>
                )
              ))}
              
              {columnVisibility.status && (
                <TableCell>
                  <Badge variant={interaction.status === 'open' ? 'default' : 'secondary'}>
                    {interaction.status.charAt(0).toUpperCase() + interaction.status.slice(1)}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InteractionsTable;
