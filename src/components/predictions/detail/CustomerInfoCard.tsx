
import React from "react";
import { CustomerLookupData } from "@/services/customerLookupService";
import { CalendarDays, User, CreditCard, Mail, Clock, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const gender = customerData?.customFields?.genero || "";
  const maritalStatus = customerData?.customFields?.status_civil || "";
  
  // Format the revenue amount
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate last active date based on days since last usage
  const calculateLastActive = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toLocaleDateString();
  };

  const engagementScore = age + 5; // Simple calculation based on age

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Customer Information</CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="flex justify-between w-full">
                <span className="text-muted-foreground">Customer ID:</span>
                <span className="font-medium">{customerId}</span>
              </span>
            </div>

            {email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="flex justify-between w-full">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="truncate max-w-[150px] font-medium">{email}</span>
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="flex justify-between w-full">
                <span className="text-muted-foreground">Engagement:</span>
                <span className="font-medium">
                  <span className={`${engagementScore > 70 ? 'text-green-600' : engagementScore > 40 ? 'text-amber-600' : 'text-red-600'}`}>
                    {engagementScore}/100
                  </span>
                </span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="flex justify-between w-full">
                <span className="text-muted-foreground">Account Age:</span>
                <span className="font-medium">{customerData?.customFields?.tempo_de_uso || 20} months</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="flex justify-between w-full">
                <span className="text-muted-foreground">Last Active:</span>
                <span className="font-medium">{calculateLastActive(lastUsage)}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="flex justify-between w-full">
                <span className="text-muted-foreground">Revenue:</span>
                <span className="font-medium">{formatCurrency(totalSpending)}</span>
              </span>
            </div>
            
            <div className="pt-3 mt-2 border-t grid grid-cols-2 gap-2">
              <div className="text-muted-foreground">Subscription:</div>
              <div className="font-medium text-right">{subscriptionType}</div>
              
              <div className="text-muted-foreground">Contract:</div>
              <div className="font-medium text-right">{contractTerm}</div>
              
              {gender && (
                <>
                  <div className="text-muted-foreground">Gender:</div>
                  <div className="font-medium text-right">{gender}</div>
                </>
              )}
              
              {maritalStatus && (
                <>
                  <div className="text-muted-foreground">Status:</div>
                  <div className="font-medium text-right">{maritalStatus}</div>
                </>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
