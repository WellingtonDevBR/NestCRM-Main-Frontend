
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomField } from "@/domain/models/customField";

interface BasicColumn {
  key: string;
  label: string;
}

interface ColumnVisibilityDropdownProps {
  columnVisibility: Record<string, boolean>;
  customFields: CustomField[];
  onToggleColumn: (column: string) => void;
  basicColumns?: BasicColumn[];
}

const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columnVisibility,
  customFields,
  onToggleColumn,
  basicColumns = [],
}) => {
  // Only show association fields that are marked for use
  const visibleFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation === true
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-2">
          <Settings className="mr-2 h-4 w-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {/* Basic columns */}
          {basicColumns.map(column => (
            <DropdownMenuCheckboxItem
              key={column.key}
              checked={columnVisibility[column.key]}
              onCheckedChange={() => onToggleColumn(column.key)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          ))}
          
          {/* Custom fields from settings */}
          {visibleFields.length > 0 && basicColumns.length > 0 && <DropdownMenuSeparator />}
          {visibleFields.length > 0 && (
            <DropdownMenuLabel className="text-xs text-muted-foreground pt-2">
              Custom Fields
            </DropdownMenuLabel>
          )}
          {visibleFields.map(field => (
            <DropdownMenuCheckboxItem
              key={field.key}
              checked={columnVisibility[field.key]}
              onCheckedChange={() => onToggleColumn(field.key)}
            >
              {field.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityDropdown;
