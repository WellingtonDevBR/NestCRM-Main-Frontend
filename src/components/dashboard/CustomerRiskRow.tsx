
import React from 'react';
import { Button } from '@/components/ui/button';
import { CustomerRiskData } from '@/domain/models/customerRisk';
import StatusBadge from './StatusBadge';
import RiskScoreBar from './RiskScoreBar';

interface CustomerRiskRowProps {
  customer: CustomerRiskData;
}

const CustomerRiskRow: React.FC<CustomerRiskRowProps> = ({ customer }) => {
  return (
    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
      <td className="py-4 text-sm">
        <div>
          <div className="font-medium">{customer.name}</div>
          <div className="text-muted-foreground text-xs">{customer.email}</div>
        </div>
      </td>
      <td className="py-4 text-sm">{customer.industry}</td>
      <td className="py-4 text-sm font-medium">{customer.value}</td>
      <td className="py-4 text-sm">
        <RiskScoreBar score={customer.riskScore} />
      </td>
      <td className="py-4 text-sm">
        <StatusBadge status={customer.status} />
      </td>
      <td className="py-4 text-sm text-right">
        <Button variant="ghost" size="sm">Contact</Button>
      </td>
    </tr>
  );
};

export default CustomerRiskRow;
