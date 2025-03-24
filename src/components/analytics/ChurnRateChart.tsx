
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartSeries } from "@/domain/models/analytics";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

interface ChurnRateChartProps {
  data: ChartSeries[];
}

const ChurnRateChart: React.FC<ChurnRateChartProps> = ({ data }) => {
  // Format the data for the chart
  const chartData = data[0]?.data.map((point, index) => {
    const dataPoint: { [key: string]: any } = { name: point.date };
    
    // Add all series values for this date point
    data.forEach(series => {
      dataPoint[series.name] = series.data[index]?.value;
    });
    
    return dataPoint;
  });

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Churn Rate Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split(' ')[0]} 
              />
              <YAxis 
                domain={[0, 'dataMax + 1']} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${value}%`, ""]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Churn Rate"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="Industry Average"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 1 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChurnRateChart;
