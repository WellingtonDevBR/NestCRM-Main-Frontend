
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { CustomField } from '@/domain/models/customField';
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";

interface SearchAndFilterBarProps {
  searchTerm: string;
  filterStatus: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: string) => void;
  columnVisibility: Record<string, boolean>;
  onToggleColumn: (column: string) => void;
  customFields: CustomField[];
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  filterStatus,
  onSearch,
  onFilterChange,
  columnVisibility,
  onToggleColumn,
  customFields,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
      <div className="flex-1">
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={onSearch}
          className="max-w-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Status: {filterStatus === 'all' ? 'All' : filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={filterStatus} onValueChange={onFilterChange}>
              <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="warning">Warning</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="critical">Critical</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ColumnVisibilityDropdown
          columnVisibility={columnVisibility}
          customFields={customFields}
          onToggleColumn={onToggleColumn}
        />
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
