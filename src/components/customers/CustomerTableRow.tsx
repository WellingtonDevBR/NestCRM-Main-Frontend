
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Customer } from "@/domain/models/customer";
import { CustomField } from "@/domain/models/customField";
import DynamicFieldRenderer from '@/components/shared/DynamicFieldRenderer';
import CustomerActions from './CustomerActions';

interface CustomerTableRowProps {
  customer: Customer;
  visibleColumns: Record<string, boolean>;
  customFields: CustomField[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  customer,
  visibleColumns,
  customFields,
  onEdit,
  onDelete
}) => {
  // Filter out association fields that are not marked for use
  const visibleFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );
  
  return (
    <TableRow key={customer.id}>
      {/* Custom fields from settings */}
      {visibleFields.map(field => {
        const isVisible = visibleColumns[field.key];
        
        // Use field.key to access the data from customer.customFields
        const fieldValue = customer.customFields ? customer.customFields[field.key] : null;
        
        return isVisible ? (
          <TableCell key={field.key}>
            <DynamicFieldRenderer 
              value={fieldValue} 
              uiConfig={field.uiConfig}
            />
          </TableCell>
        ) : null;
      })}
      
      <TableCell className="text-right">
        <CustomerActions 
          customer={customer} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </TableCell>
    </TableRow>
  );
};

export default CustomerTableRow;
