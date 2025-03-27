
import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { DashboardSidebarHeader } from "./sidebar/SidebarHeader";
import { SidebarNavGroup } from "./sidebar/SidebarNavGroup";
import { SidebarUserProfile } from "./sidebar/SidebarUserProfile";
import { mainNavItems, secondaryNavItems } from "./sidebar/navItems";
import { SidebarToggleButton } from "./sidebar/SidebarToggleButton";

// Export the toggle button component for use elsewhere
export { SidebarToggleButton };

const DashboardSidebar: React.FC = () => {
  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-colors duration-200" data-sidebar="sidebar">
      <DashboardSidebarHeader />
      
      <SidebarContent>
        <SidebarNavGroup label="Main" items={mainNavItems} />
        
        <SidebarSeparator />
        
        <SidebarNavGroup label="Management" items={secondaryNavItems} />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarUserProfile />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
