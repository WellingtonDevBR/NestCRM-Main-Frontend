
import React from "react";
import { TableBody as UITableBody, TableCell, TableRow } from "@/components/ui/table";
import { Customer } from "@/domain/models/customer";
import { CustomField } from "@/domain/models/customField";
import CustomerTableRow from "../CustomerTableRow";

interface TableBodyProps {
  filteredCustomers: Customer[];
  columnVisibility: Record<string, boolean>;
  customFields: CustomField[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const TableBody: React.FC<TableBodyProps> = ({
  filteredCustomers,
  columnVisibility,
  customFields,
  onEdit,
  onDelete
}) => {
  return (
    <UITableBody>
      {filteredCustomers.length === 0 ? (
        <TableRow>
          <TableCell 
            colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} 
            className="h-32 text-center"
          >
            No customers found.
          </TableCell>
        </TableRow>
      ) : (
        filteredCustomers.map((customer) => (
          <CustomerTableRow
            key={customer.id}
            customer={customer}
            visibleColumns={columnVisibility}
            customFields={customFields}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </UITableBody>
  );
};

export default TableBody;
