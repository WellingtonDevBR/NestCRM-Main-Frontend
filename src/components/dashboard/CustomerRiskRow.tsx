
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerRiskData, ColumnVisibility } from '@/domain/models/customerRisk';
import { CustomField } from '@/domain/models/customer';
import StatusBadge from './StatusBadge';
import RiskScoreBar from './RiskScoreBar';
import { Edit } from 'lucide-react';

interface CustomerRiskRowProps {
  customer: CustomerRiskData;
  columnVisibility: ColumnVisibility;
  customFields: CustomField[];
}

const CustomerRiskRow: React.FC<CustomerRiskRowProps> = ({ 
  customer, 
  columnVisibility,
  customFields 
}) => {
  return (
    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
      {columnVisibility.name && (
        <td className="py-4 text-sm">
          <div>
            <div className="font-medium">{customer.name}</div>
            {columnVisibility.email && (
              <div className="text-muted-foreground text-xs">{customer.email}</div>
            )}
          </div>
        </td>
      )}
      
      {/* Only show email as a separate column if name is not visible */}
      {!columnVisibility.name && columnVisibility.email && (
        <td className="py-4 text-sm">{customer.email}</td>
      )}
      
      {columnVisibility.industry && (
        <td className="py-4 text-sm">{customer.industry}</td>
      )}
      
      {columnVisibility.value && (
        <td className="py-4 text-sm font-medium">{customer.value}</td>
      )}
      
      {columnVisibility.riskScore && (
        <td className="py-4 text-sm">
          <RiskScoreBar score={customer.riskScore} />
        </td>
      )}
      
      {columnVisibility.status && (
        <td className="py-4 text-sm">
          <StatusBadge status={customer.status} />
        </td>
      )}
      
      {/* Display custom field values */}
      {customFields.map(field => (
        columnVisibility[field.key] && (
          <td key={field.key} className="py-4 text-sm">
            {customer.customFields?.[field.key] || "-"}
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
