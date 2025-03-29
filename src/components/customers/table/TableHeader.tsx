
import React from "react";
import { Customer } from "@/domain/models/customer";
import { CustomField } from "@/domain/models/customField";
import SearchInput from "../SearchInput";
import ColumnVisibilityDropdown from "@/components/shared/ColumnVisibilityDropdown";
import { Table, TableHeader as UITableHeader, TableRow, TableHead } from "@/components/ui/table";
import TableBody from "./TableBody";

interface TableHeaderProps {
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  columnVisibility: Record<string, boolean>;
  customFields: CustomField[];
  onToggleColumn: (column: string) => void;
  filteredCustomers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  children: React.ReactNode;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  searchTerm,
  onSearch,
  columnVisibility,
  customFields,
  onToggleColumn,
  filteredCustomers,
  onEdit,
  onDelete,
  children
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SearchInput searchTerm={searchTerm} onSearch={onSearch} />
        <ColumnVisibilityDropdown 
          columnVisibility={columnVisibility}
          customFields={customFields || []}
          onToggleColumn={onToggleColumn}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <UITableHeader>
            <TableRow>
              {/* Render custom field headers using the label for display */}
              {customFields?.map(field => 
                columnVisibility[field.key] && (
                  <TableHead key={field.key}>{field.label}</TableHead>
                )
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </UITableHeader>
          <TableBody 
            filteredCustomers={filteredCustomers}
            columnVisibility={columnVisibility}
            customFields={customFields}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </Table>
      </div>

      {children}
    </div>
  );
};

export default TableHeader;
