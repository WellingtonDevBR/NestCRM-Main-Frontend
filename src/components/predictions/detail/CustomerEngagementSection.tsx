
import React from "react";
import { CustomerLookupData } from "@/services/customerLookupService";
import { TrendingDown, TrendingUp, Minus, Clock, Users, Activity, MessageSquare, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerEngagementProps {
  customerData: CustomerLookupData | null;
  loading: boolean;
}

const CustomerEngagementSection: React.FC<CustomerEngagementProps> = ({
  customerData,
  loading
}) => {
  // Extract or calculate values from customer data
  const supportTickets = customerData?.customFields?.support_tickets || 0;
  const usageDuration = customerData?.customFields?.tempo_de_uso || 0;
  const dependencies = customerData?.customFields?.dependentes || 0;
  const delays = customerData?.customFields?.atrasos || 0;
  const lastUsage = customerData?.customFields?.ultimo_uso || 0;
  
  // Calculate satisfaction score based on delays (inverse relationship)
  const calculateSatisfactionScore = (delays: number) => {
    const score = 5 - Math.min(Math.floor(delays / 10), 4);
    return score;
  };
  
  const satisfactionScore = calculateSatisfactionScore(delays);
  
  // Determine activity trend based on last usage
  const getActivityTrend = (lastUsage: number) => {
    if (lastUsage < 7) return { 
      text: "Increasing", 
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      color: "bg-green-100 text-green-800 border-green-200"
    };
    if (lastUsage > 20) return { 
      text: "Decreasing", 
      icon: <TrendingDown className="h-4 w-4 text-red-600" />,
      color: "bg-red-100 text-red-800 border-red-200"
    };
    return { 
      text: "Stable", 
      icon: <Minus className="h-4 w-4 text-blue-600" />,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    };
  };
  
  const activityTrend = getActivityTrend(lastUsage);
  
  // Calculate feature adoption percentage 
  const calculateFeatureAdoption = (usageDuration: number, dependencies: number) => {
    return Math.min(Math.round(60 + (usageDuration / 2) - (dependencies * 5)), 95);
  };
  
  const featureAdoption = calculateFeatureAdoption(usageDuration, dependencies);

  // Calculate stars for satisfaction rating
  const renderSatisfactionStars = (score: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Heart 
            key={i} 
            className={`h-4 w-4 ${i < score ? 'text-red-500 fill-red-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6 transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Customer Engagement</CardTitle>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
            <div className="space-y-3 animate-pulse">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Support History
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Total Tickets</div>
                  <div className="text-lg font-semibold">{supportTickets}</div>
                </div>
                
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Resolution Time</div>
                  <div className="text-lg font-semibold">{Math.max(16, Math.round(delays / 2))}h</div>
                </div>
              </div>
              
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Satisfaction Score</div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{satisfactionScore}/5</div>
                  {renderSatisfactionStars(satisfactionScore)}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Usage Metrics
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Interactions</div>
                  <div className="text-lg font-semibold">{Math.round(usageDuration * 2.5)}</div>
                </div>
                
                <div className="bg-muted/40 p-3 rounded-lg">
                  <div className="text-xs text-muted-foreground mb-1">Feature Adoption</div>
                  <div className="text-lg font-semibold">{featureAdoption}%</div>
                </div>
              </div>
              
              <div className="bg-muted/40 p-3 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Recent Activity</div>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{activityTrend.text}</div>
                  <Badge className={`${activityTrend.color} flex items-center gap-1`}>
                    {activityTrend.text}
                    {activityTrend.icon}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerEngagementSection;
