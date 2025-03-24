
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricData } from "@/domain/models/analytics";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  metric: MetricData;
  change?: number;
  prefix?: string;
  suffix?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  metric, 
  change, 
  prefix = "", 
  suffix = "" 
}) => {
  // Format the metric value with the prefix and suffix
  const formattedValue = `${prefix}${metric.value}${suffix}`;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">{formattedValue}</div>
          {change !== undefined && (
            <div className="flex items-center text-xs">
              {change > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{change}%</span>
                </>
              ) : change < 0 ? (
                <>
                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  <span className="text-red-500">{change}%</span>
                </>
              ) : (
                <>
                  <Minus className="w-3 h-3 text-gray-500 mr-1" />
                  <span className="text-gray-500">0%</span>
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
