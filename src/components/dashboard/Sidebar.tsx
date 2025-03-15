
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import SidebarNavItems from "./SidebarNavItems";

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
      
      {/* Navigation Items */}
      <SidebarNavItems activeTab={activeTab} setActiveTab={setActiveTab} />
      
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
