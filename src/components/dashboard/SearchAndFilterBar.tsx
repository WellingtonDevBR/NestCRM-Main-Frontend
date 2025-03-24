
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { CustomField } from '@/domain/models/customer';
import { ColumnVisibility } from '@/domain/models/customerRisk';

interface SearchAndFilterBarProps {
  searchTerm: string;
  filterStatus: string;
  columnVisibility: ColumnVisibility;
  customFields: CustomField[];
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (status: string) => void;
  onToggleColumn: (column: string) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  filterStatus,
  columnVisibility,
  customFields,
  onSearch,
  onFilterChange,
  onToggleColumn
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.name}
                onCheckedChange={() => onToggleColumn('name')}
              >
                Company
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.email}
                onCheckedChange={() => onToggleColumn('email')}
              >
                Email
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.industry}
                onCheckedChange={() => onToggleColumn('industry')}
              >
                Industry
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.value}
                onCheckedChange={() => onToggleColumn('value')}
              >
                Value
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.riskScore}
                onCheckedChange={() => onToggleColumn('riskScore')}
              >
                Risk Score
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={columnVisibility.status}
                onCheckedChange={() => onToggleColumn('status')}
              >
                Status
              </DropdownMenuCheckboxItem>
              
              {/* Custom fields column toggles */}
              {customFields?.length > 0 && <DropdownMenuSeparator />}
              {customFields?.map(field => (
                <DropdownMenuCheckboxItem
                  key={field.key}
                  checked={columnVisibility[field.key] ?? false}
                  onCheckedChange={() => onToggleColumn(field.key)}
                >
                  {field.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center gap-2">
        <Input 
          placeholder="Search customers..." 
          value={searchTerm} 
          onChange={onSearch}
          className="w-full sm:w-64"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {filterStatus === 'All' ? 'All Risks' : filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onFilterChange('All')}>
              All Risks
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('High Risk')}>
              High Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Medium Risk')}>
              Medium Risk
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('Low Risk')}>
              Low Risk
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default SearchAndFilterBar;
