
import { Users, AlertTriangle, PieChart } from "lucide-react";

const StatisticsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Total Customers</h3>
          <Users className="h-5 w-5 text-primary" />
        </div>
        <p className="text-3xl font-bold">1,284</p>
        <div className="mt-2 text-sm text-foreground/70">
          <span className="text-green-500">↑ 12%</span> from last month
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">At Risk</h3>
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
        <p className="text-3xl font-bold">24</p>
        <div className="mt-2 text-sm text-foreground/70">
          <span className="text-red-500">↑ 5%</span> from last month
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Monthly Revenue</h3>
          <PieChart className="h-5 w-5 text-primary" />
        </div>
        <p className="text-3xl font-bold">$48,240</p>
        <div className="mt-2 text-sm text-foreground/70">
          <span className="text-green-500">↑ 8%</span> from last month
        </div>
      </div>
    </div>
  );
};

export default StatisticsOverview;
