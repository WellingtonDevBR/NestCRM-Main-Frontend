
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerRiskData } from '@/domain/models/customerRisk';
import { CustomField } from '@/domain/models/customField';
import { Edit } from 'lucide-react';
import DynamicFieldRenderer from '@/components/shared/DynamicFieldRenderer';

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
  // Filter out association fields that are not marked for use
  const visibleFields = customFields.filter(field => 
    !field.isAssociationField || field.useAsAssociation
  );

  return (
    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
      {/* Display custom field values based on visibility settings */}
      {visibleFields.map(field => 
        columnVisibility[field.key] && (
          <td key={field.key} className="py-4 text-sm">
            <DynamicFieldRenderer 
              value={customer.customFields?.[field.key]} 
              uiConfig={field.uiConfig}
            />
          </td>
        )
      )}
      
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
