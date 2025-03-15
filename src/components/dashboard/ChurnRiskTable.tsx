
import { Button } from "@/components/ui/button";

interface CustomerRisk {
  name: string;
  score: number;
  factors: string;
  date: string;
}

const ChurnRiskTable = () => {
  const customers: CustomerRisk[] = [
    { name: "Acme Corp", score: 85, factors: "Low engagement, Support tickets", date: "2 days ago" },
    { name: "Apex Solutions", score: 72, factors: "Payment delays, Feature usage drop", date: "5 days ago" },
    { name: "Tech Innovate", score: 64, factors: "Contract ending soon, Competitor research", date: "1 week ago" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-border shadow-sm mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Churn Risk Predictions</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Risk Factors</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">Last Activity</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-foreground/70 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {customers.map((customer, i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium">{customer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 text-red-800">
                    {customer.score}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {customer.factors}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/70">
                  {customer.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Button variant="outline" size="sm">Contact</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChurnRiskTable;
