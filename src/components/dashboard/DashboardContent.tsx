
import StatisticsOverview from "./StatisticsOverview";
import ChurnRiskTable from "./ChurnRiskTable";
import SetupGuide from "./SetupGuide";

const DashboardContent = () => {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome to NESTCRM</h1>
        <p className="text-foreground/70">
          Your AI-powered customer retention platform
        </p>
      </div>

      {/* Overview Cards */}
      <StatisticsOverview />

      {/* Churn Risk Predictions Table */}
      <ChurnRiskTable />

      {/* Getting Started Section */}
      <SetupGuide />
    </main>
  );
};

export default DashboardContent;
