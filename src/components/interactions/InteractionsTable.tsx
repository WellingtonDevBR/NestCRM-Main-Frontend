
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
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

interface InteractionsTableProps {
  interactions: Interaction[];
  isLoading: boolean;
}

const InteractionsTable: React.FC<InteractionsTableProps> = ({ interactions, isLoading }) => {
  // Using the targeted query to only fetch Interaction specific fields
  const { data: interactionFieldsData, isLoading: isLoadingInteractionFields } = 
    useCustomFields().useCategoryFields("Interaction");
  
  // Get the interaction custom fields
  const interactionCustomFields = interactionFieldsData?.fields || [];

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (interactionCustomFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      interactionCustomFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
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
          customFields={interactionCustomFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {interactionCustomFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {interactions.map((interaction) => (
            <TableRow key={interaction.id} className="cursor-pointer hover:bg-gray-50">
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InteractionsTable;
