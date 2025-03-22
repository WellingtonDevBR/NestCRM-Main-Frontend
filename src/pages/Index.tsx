
import React, { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Pricing from "@/components/home/Pricing";
import { isOnDashboardSubdomain } from "@/utils/subdomain";

const Index: React.FC = () => {
  useEffect(() => {
    // If on subdomain, redirect to the dashboard page
    if (isOnDashboardSubdomain()) {
      window.location.pathname = "/dashboard";
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
