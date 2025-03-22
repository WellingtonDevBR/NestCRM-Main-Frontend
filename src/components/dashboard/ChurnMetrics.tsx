
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const churnRateData = [
  { month: 'Jan', rate: 5.2 },
  { month: 'Feb', rate: 4.8 },
  { month: 'Mar', rate: 4.9 },
  { month: 'Apr', rate: 5.1 },
  { month: 'May', rate: 4.7 },
  { month: 'Jun', rate: 4.5 },
  { month: 'Jul', rate: 4.3 },
  { month: 'Aug', rate: 4.3 },
];

const riskCategoriesData = [
  { category: 'High Risk', value: 34, color: '#ef4444' },
  { category: 'Medium Risk', value: 125, color: '#f59e0b' },
  { category: 'Low Risk', value: 498, color: '#10b981' },
  { category: 'Stable', value: 591, color: '#3b82f6' },
];

const retentionBySegmentData = [
  { segment: 'Enterprise', retention: 96 },
  { segment: 'Mid-Market', retention: 91 },
  { segment: 'SMB', retention: 84 },
  { segment: 'Startup', retention: 79 },
];

const ChurnMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Churn Rate (%)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={churnRateData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: 'none' 
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Customer Risk Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskCategoriesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} customers`, name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: 'none' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Retention Rate by Segment (%)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[300px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={retentionBySegmentData}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="segment" stroke="#6b7280" />
                <YAxis domain={[70, 100]} stroke="#6b7280" />
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Retention Rate']}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    border: 'none' 
                  }}
                />
                <Bar dataKey="retention" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Churn Prediction Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 list-styled">
            <li className="text-sm">
              <span className="font-medium">Subscription price sensitivity:</span> Price increases correlate with a 15% higher churn probability for SMB customers.
            </li>
            <li className="text-sm">
              <span className="font-medium">Feature usage patterns:</span> Customers who don't use the reporting module in 30 days have a 3x higher churn risk.
            </li>
            <li className="text-sm">
              <span className="font-medium">Support interactions:</span> Customers with more than 3 support tickets in a month show elevated churn risk.
            </li>
            <li className="text-sm">
              <span className="font-medium">Engagement trend:</span> A 40% decline in login frequency often precedes churn by 45-60 days.
            </li>
            <li className="text-sm">
              <span className="font-medium">Recommendation:</span> Focus on onboarding improvements and feature education for new Enterprise customers.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChurnMetrics;
