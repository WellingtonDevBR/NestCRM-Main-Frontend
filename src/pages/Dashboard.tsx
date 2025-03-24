
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ChurnMetrics />
        <CustomerList />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
