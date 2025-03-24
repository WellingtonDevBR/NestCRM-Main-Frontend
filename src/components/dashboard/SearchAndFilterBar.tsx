
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface SearchAndFilterBarProps {
  searchTerm: string;
  filterStatus: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (status: string) => void;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  searchTerm,
  filterStatus,
  onSearch,
  onFilterChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div></div>
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
