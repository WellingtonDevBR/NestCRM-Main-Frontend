
import React from "react";
import { Link } from "react-router-dom";
import { getSubdomain } from "@/utils/subdomain";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  Settings,
  HelpCircle,
  FileText,
  ChartBar,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger
} from "@/components/ui/sidebar";

const DashboardSidebar: React.FC = () => {
  const subdomain = getSubdomain();

  // Main navigation items
  const mainNavItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { title: "Customers", icon: Users, path: "/customers" },
    { title: "Predictions", icon: TrendingUp, path: "/predictions" },
    { title: "Risk Alerts", icon: AlertTriangle, path: "/risk-alerts" },
    { title: "Customer Feedback", icon: MessageSquare, path: "/feedback" },
    { title: "Analytics", icon: ChartBar, path: "/analytics" },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { title: "Reports", icon: FileText, path: "/reports" },
    { title: "Settings", icon: Settings, path: "/settings" },
    { title: "Help & Support", icon: HelpCircle, path: "/support" },
  ];

  return (
    <Sidebar className="border-r border-purple-100" data-sidebar="sidebar">
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
          <SidebarTrigger className="mr-1" />
        </div>
        
        <div className="px-4 mt-4">
          <div className="group flex flex-col">
            <div className="text-xs text-muted-foreground">Company</div>
            <div className="font-medium">{subdomain || "Demo Company"}</div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.path}>
                      <item.icon className="text-purple-500" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarSeparator />
        
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.path}>
                      <item.icon className="text-purple-500" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-purple-50 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User size={16} className="text-purple-700" />
              </div>
              <div>
                <div className="text-sm font-medium">Admin User</div>
                <div className="text-xs text-muted-foreground">View Profile</div>
              </div>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
