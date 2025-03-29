
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
import { useCustomFields } from "@/hooks/useCustomFields";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import DynamicFieldRenderer from "@/components/shared/DynamicFieldRenderer";
import InteractionActions from "./InteractionActions";

interface InteractionsTableProps {
  interactions: Interaction[];
  isLoading: boolean;
  onView?: (interaction: Interaction) => void;
  onEdit?: (interaction: Interaction) => void;
  onFollow?: (interaction: Interaction) => void;
  onMarkAsResolved?: (interactionId: string) => void;
  onDelete?: (interactionId: string) => void;
}

const InteractionsTable: React.FC<InteractionsTableProps> = ({ 
  interactions, 
  isLoading,
  onView,
  onEdit,
  onFollow,
  onMarkAsResolved,
  onDelete
}) => {
  // Using the targeted query to only fetch Interaction specific fields
  const { data: interactionFieldsData, isLoading: isLoadingInteractionFields } = 
    useCustomFields().useCategoryFields("Interaction");
  
  // Get the interaction custom fields
  const interactionCustomFields = interactionFieldsData?.fields || [];
  
  // Filter out association fields that are not marked for use
  const visibleInteractionFields = interactionCustomFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );

  // Column visibility state - start with all custom fields visible
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Initialize column visibility for custom fields
  useEffect(() => {
    if (visibleInteractionFields.length > 0) {
      const customFieldVisibility: Record<string, boolean> = {};
      visibleInteractionFields.forEach(field => {
        customFieldVisibility[field.key] = true;
      });
      
      setColumnVisibility(customFieldVisibility);
    }
  }, [visibleInteractionFields]);

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
          customFields={visibleInteractionFields}
          onToggleColumn={toggleColumnVisibility}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* Render custom field headers dynamically */}
            {visibleInteractionFields.map(field => (
              columnVisibility[field.key] && <TableHead key={field.key}>{field.label}</TableHead>
            ))}
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interactions.map((interaction) => (
            <TableRow key={interaction.id} className="hover:bg-gray-50">
              {/* Render custom field values if present */}
              {visibleInteractionFields.map(field => (
                columnVisibility[field.key] && (
                  <TableCell key={field.key}>
                    <DynamicFieldRenderer 
                      value={interaction.customFields?.[field.key]}
                      uiConfig={field.uiConfig}
                    />
                  </TableCell>
                )
              ))}
              <TableCell className="text-right">
                <InteractionActions 
                  interaction={interaction}
                  onView={onView}
                  onEdit={onEdit}
                  onFollow={onFollow}
                  onMarkAsResolved={onMarkAsResolved}
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

export default InteractionsTable;
