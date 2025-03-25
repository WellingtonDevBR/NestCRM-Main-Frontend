
import React from "react";
import { Link } from "react-router-dom";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar";
import { getSubdomain } from "@/utils/subdomain";
import { useSidebar } from "@/components/ui/sidebar";

export const DashboardSidebarHeader: React.FC = () => {
  const subdomain = getSubdomain();
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarHeader className="py-4">
      <div className="px-2 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-r from-purple-600 to-purple-400 text-white font-bold">
            N
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-400">
            NestCRM
          </span>
        </Link>
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-1"
          onClick={toggleSidebar}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="px-4 mt-4">
        <div className="group flex flex-col">
          <div className="text-xs text-muted-foreground">Company</div>
          <div className="font-medium">{subdomain || "Demo Company"}</div>
        </div>
      </div>
    </SidebarHeader>
  );
};
