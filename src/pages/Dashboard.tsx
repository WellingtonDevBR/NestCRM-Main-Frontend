
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import ChurnMetrics from "@/components/dashboard/ChurnMetrics";
import CustomerList from "@/components/dashboard/CustomerList";
import { isOnDashboardSubdomain, redirectToMainDomain } from "@/utils/subdomain";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If not on a subdomain, redirect to login
    // In a real app, you'd also check authentication status
    if (!isOnDashboardSubdomain()) {
      navigate("/login");
    }
  }, [navigate]);

  // If not on subdomain, don't render dashboard content
  if (!isOnDashboardSubdomain()) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <DashboardLayout>
        <div className="space-y-8">
          <ChurnMetrics />
          <CustomerList />
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
