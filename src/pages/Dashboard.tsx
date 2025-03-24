
import React from "react";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <ChurnMetrics />
      <CustomerList />
    </div>
  );
};

export default Dashboard;
