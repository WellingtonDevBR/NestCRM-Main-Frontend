
import { Button } from "@/components/ui/button";
import { 
  Home, Users, BarChart3, Settings, AlertTriangle, 
  Inbox, Calendar, CreditCard
} from "lucide-react";

interface SidebarNavItemsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SidebarNavItems = ({ activeTab, setActiveTab }: SidebarNavItemsProps) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "customers", label: "Customers", icon: Users },
    { id: "churn-prediction", label: "Churn Prediction", icon: AlertTriangle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`w-full justify-start ${activeTab === item.id ? "bg-sidebar-accent/20" : ""}`}
          onClick={() => setActiveTab(item.id)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      ))}
    </nav>
  );
};

export default SidebarNavItems;
