
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Users, BarChart3, Settings, Bell, Search, User, LogOut,
  PieChart, AlertTriangle, Inbox, Calendar, CreditCard
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-secondary/30">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sidebar-primary to-sidebar-accent">NESTCRM</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "dashboard" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "customers" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("customers")}
          >
            <Users className="mr-2 h-4 w-4" />
            Customers
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "churn-prediction" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("churn-prediction")}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Churn Prediction
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "analytics" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "inbox" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("inbox")}
          >
            <Inbox className="mr-2 h-4 w-4" />
            Inbox
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "calendar" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("calendar")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "billing" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Billing
          </Button>
          
          <Button
            variant="ghost"
            className={`w-full justify-start ${activeTab === "settings" ? "bg-sidebar-accent/20" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-sidebar-accent/30 flex items-center justify-center mr-2">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-sidebar-foreground/70">john@example.com</div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-background border-b border-border flex items-center justify-between p-4">
          <div className="flex-1 flex items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/50" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background text-sm"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Button variant="outline">Upgrade</Button>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome to NESTCRM</h1>
            <p className="text-foreground/70">
              Your AI-powered customer retention platform
            </p>
          </div>

          {/* Overview Cards */}
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

          {/* Placeholder for AI Predictions */}
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
                  {[
                    { name: "Acme Corp", score: 85, factors: "Low engagement, Support tickets", date: "2 days ago" },
                    { name: "Apex Solutions", score: 72, factors: "Payment delays, Feature usage drop", date: "5 days ago" },
                    { name: "Tech Innovate", score: 64, factors: "Contract ending soon, Competitor research", date: "1 week ago" },
                  ].map((customer, i) => (
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

          {/* Getting Started Section */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Quick Setup Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <h3 className="font-medium mb-2">Import Your Customers</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Upload your customer data or connect your CRM system.
                </p>
                <Button variant="outline" size="sm">Import Data</Button>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <h3 className="font-medium mb-2">Configure AI Model</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Set up the parameters for the churn prediction algorithm.
                </p>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              
              <div className="p-4 border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <h3 className="font-medium mb-2">Set Up Alerts</h3>
                <p className="text-sm text-foreground/70 mb-4">
                  Choose how you want to be notified about at-risk customers.
                </p>
                <Button variant="outline" size="sm">Set Alerts</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
