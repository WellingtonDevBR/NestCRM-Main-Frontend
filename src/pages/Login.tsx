
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { isOnDashboardSubdomain, redirectToMainDomain } from "@/utils/subdomain";

const Login: React.FC = () => {
  useEffect(() => {
    // If on subdomain, redirect to main domain for login
    if (isOnDashboardSubdomain()) {
      redirectToMainDomain();
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sign in to NestCRM</h1>
            <p className="text-muted-foreground">
              Enter your details to access your dashboard
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
