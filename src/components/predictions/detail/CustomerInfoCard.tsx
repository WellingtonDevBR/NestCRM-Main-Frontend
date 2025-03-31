
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PredictionMapping } from "@/domain/models/predictionMapping";
import { formatModelFieldValue } from "@/utils/fieldMappingUtils";

interface CustomerInfoCardProps {
  customerId: string;
  customerData: any;
  mappingData: PredictionMapping | null;
  loading: boolean;
  getFieldValue: (modelField: string) => any;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  customerId,
  customerData,
  mappingData,
  loading,
  getFieldValue
}) => {
  if (loading) {
    return (
      <Card className="shadow-sm h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  // Define key customer attributes to display - using model field names
  const customerAttributes = [
    { label: "Age", field: "Age" },
    { label: "Gender", field: "Gender" },
    { label: "Relationship Status", field: "Partner" },
    { label: "Dependents", field: "Dependents" },
    { label: "Subscription", field: "Subscription_Type" },
    { label: "Contract Length", field: "Contract_Length" },
    { label: "Customer Tenure", field: "Tenure" },
  ];

  // Get email from customer data
  const email = customerData?.associations?.email || customerData?.customFields?.email || "";

  return (
    <Card className="shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Customer ID: <span className="font-medium text-foreground">{customerId}</span>
          {email && (
            <>
              <br />
              Email: <span className="font-medium text-foreground">{email}</span>
            </>
          )}
        </p>

        <div className="space-y-3">
          {customerAttributes.map(attr => {
            const value = getFieldValue(attr.field);
            
            // Skip if we don't have a mapping for this field
            if (value === undefined) return null;
            
            return (
              <div key={attr.field} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{attr.label}:</span>
                <span className="font-medium">{formatModelFieldValue(value, attr.field)}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfoCard;
