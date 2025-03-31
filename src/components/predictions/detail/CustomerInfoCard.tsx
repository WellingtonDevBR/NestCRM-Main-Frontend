
import React from "react";
import { CustomerLookupData } from "@/services/customerLookupService";

interface CustomerInfoCardProps {
  customerId: string;
  customerData: CustomerLookupData | null;
  loading: boolean;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({ 
  customerId, 
  customerData,
  loading
}) => {
  // Extract relevant customer data or use fallbacks
  const subscriptionType = customerData?.customFields?.tipo_assinatura || "Standard";
  const contractTerm = customerData?.customFields?.tempo_contrato || "Monthly";
  const age = customerData?.customFields?.idade || 30;
  const lastUsage = customerData?.customFields?.ultimo_uso || 30;
  const totalSpending = customerData?.customFields?.gastos_totais || 0;
  const email = customerData?.customFields?.email || customerData?.associations?.email || "";
  
  // Format the revenue amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Calculate last active date based on days since last usage
  const calculateLastActive = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString();
  };

  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="font-medium text-lg mb-2">Customer Information</h3>
      
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Customer ID:</span>
            <span>{customerId}</span>
          </div>

          {email && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="truncate max-w-[150px]">{email}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Engagement Score:</span>
            <span>{age + 5}/100</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Age:</span>
            <span>{customerData?.customFields?.tempo_de_uso || 20} months</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last Active:</span>
            <span>{calculateLastActive(lastUsage)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Revenue:</span>
            <span>{formatCurrency(totalSpending)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subscription:</span>
            <span>{subscriptionType} ({contractTerm})</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerInfoCard;
