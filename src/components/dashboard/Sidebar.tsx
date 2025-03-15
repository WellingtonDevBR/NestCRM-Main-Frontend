
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, Users, BarChart3, Settings, User, LogOut,
  AlertTriangle, Inbox, Calendar, CreditCard
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  return (
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
  );
};

export default Sidebar;
