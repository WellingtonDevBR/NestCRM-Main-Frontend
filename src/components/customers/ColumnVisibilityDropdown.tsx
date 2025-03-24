
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

interface ColumnVisibilityDropdownProps {
  columnVisibility: Record<string, boolean>;
  customFields: string[];
  onToggleColumn: (column: string) => void;
}

const ColumnVisibilityDropdown: React.FC<ColumnVisibilityDropdownProps> = ({
  columnVisibility,
  customFields,
  onToggleColumn,
}) => {
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
          <DropdownMenuCheckboxItem
            checked={columnVisibility.name}
            onCheckedChange={() => onToggleColumn('name')}
          >
            Name
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.email}
            onCheckedChange={() => onToggleColumn('email')}
          >
            Email
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.phone}
            onCheckedChange={() => onToggleColumn('phone')}
          >
            Phone
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={columnVisibility.createdAt}
            onCheckedChange={() => onToggleColumn('createdAt')}
          >
            Created Date
          </DropdownMenuCheckboxItem>
          
          {/* Custom fields column toggles */}
          {customFields.length > 0 && <DropdownMenuSeparator />}
          {customFields.map(field => (
            <DropdownMenuCheckboxItem
              key={field}
              checked={columnVisibility[field]}
              onCheckedChange={() => onToggleColumn(field)}
            >
              {field}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnVisibilityDropdown;
