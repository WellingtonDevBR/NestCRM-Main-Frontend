
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import SidebarNavItems from "./SidebarNavItems";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const { signOut, user } = useAuth();
  
  const handleSignOut = async () => {
    try {
      toast.loading("Signing out...");
      await signOut();
      // No need for navigation here as signOut in authService.ts handles the redirect
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

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
            <div className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</div>
            <div className="text-xs text-sidebar-foreground/70">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sm hover:bg-sidebar-muted/50 hover:text-sidebar-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
