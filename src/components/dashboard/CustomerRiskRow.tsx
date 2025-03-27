
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerRiskData } from '@/domain/models/customerRisk';
import { CustomField } from '@/domain/models/customField';
import { Edit } from 'lucide-react';
import DynamicFieldRenderer from '@/components/shared/DynamicFieldRenderer';
import { TableCell } from '@/components/ui/table';

interface CustomerRiskRowProps {
  customer: CustomerRiskData;
  columnVisibility: Record<string, boolean>;
  customFields: CustomField[];
}

const CustomerRiskRow: React.FC<CustomerRiskRowProps> = ({ 
  customer, 
  columnVisibility,
  customFields 
}) => {
  // Function to get the custom field definition by key
  const getFieldByKey = (key: string): CustomField | undefined => {
    return customFields.find(field => field.key === key);
  };

  return (
    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
      {/* Display custom field values */}
      {customFields.map(field => (
        columnVisibility[field.key] && (
          <td key={field.key} className="py-4 text-sm">
            <DynamicFieldRenderer 
              value={customer.customFields?.[field.key]} 
              uiConfig={field.uiConfig}
            />
          </td>
        )
      ))}
      
      <td className="py-4 text-sm text-right">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Details
        </Button>
      </td>
    </tr>
  );
};

export default CustomerRiskRow;
